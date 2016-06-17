var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , _ = require('underscore')
    , async = require('async')
    , md5 = require('md5')
    , mkdirp = require('mkdirp')
    , jwt = require('jsonwebtoken')
    , redis = require('../redis')
    , mail = require('../mail');


/**
 * @api {get} /users Get all users
 * @apiName Users list
 *
 * @apiGroup User
 * @apiPermission Admin
 *
 * @apiParam {String} skip
 * @apiParam {String} limit
 * @apiParam {String} fields
 *
 */
exports.list = function (req, res) {
    var params = m.getBody(req);
    m.find(models.User, {}, res, res, params)
};


/**
 * @api {get} /me Get user info by token value
 * @apiName User info
 * @apiGroup User
 * @apiPermission oAuth2
 *
 */
exports.me = function (req, res) {
    m.findOne(models.User, {_id: req.userId}, res, res, {publish: true})
};


/**
 * @api {post} /update-password Update password
 * @apiName Update password
 * @apiGroup User
 * @apiPermission oAuth2
 *
 * @apiParam {String} oldPassword
 * @apiParam {String} newPassword
 *
 */
exports.update_password = function (req, res) {
    var params = m.getBody(req)
    redis.get('token_' + req.headers['authorization'], function (err, r) {
        if (err || !r) {
            return m.ecb(399, {
                success: false,
                message: "Failed to authenticate the token."
            }, res);
        }
        var arr = r.split('_');
        var userId = arr[0];
        m.findOne(models.User, {_id: userId}, res, function (user) {
            user.comparePassword(params.oldPassword, function (err, isMatch) {
                if (err || !isMatch) {
                    return m.ecb(401, err, res)
                }
                user.password = md5(params.newPassword);
                user.save(function (e, r) {
                    if (e) {
                        m.ecb(399, e, res)
                    } else {
                        m.scb(r.publish, res)
                    }
                })
            });
        })
    });

};


/**
 * @api {get} /send-confirm Send confirm code on user email
 * @apiName Send confirm
 * @apiGroup Email

 * @apiParam {String} login Username or Email
 */
exports.send_confirm = function (req, res) {
    var login = m.getBody(req).login;
    m.findOne(models.User, {
        $or: [
            {username: login},
            {email: login}
        ]
    }, res, function (user) {
        mail.send_confirm(user, res, res)
    })
};


/**
 * @api {get} /send-restore Send restore code for change password on user email
 * @apiName Send restore
 * @apiGroup Email
 *
 * @apiParam {String} login Username or Email
 *
 */
exports.send_restore = function (req, res) {
    var email = m.getBody(req).email;
    m.findOne(models.User, {email: email}, res, function (user) {
        user.send_restore(res, res)
    })
};


/**
 * @api {get} /confirm Confirm you email in DB by confirm code
 * @apiName Confirm
 * @apiGroup User
 *
 * @apiParam {String} confirm_code
 *
 */
exports.confirm = function (req, res) {
    var code = m.getBody(req).confirm_code;
    m.findOne(models.User, {confirm_code: code}, res, function (user) {
        user.confirm_code = true;
        m.save(user, res, function () {
            m.createToken(models, user, res, res)
        }, {publish: true})
    })
};


/**
 * @api {get} /restore Change your password in DB by a restore code
 * @apiName Restore
 * @apiGroup User
 *
 * @apiParam {String} restore_code
 * @apiParam {String} password
 *
 */
exports.restore = function (req, res) {
    var data = m.getBody(req);
    if (!data.password) {
        m.ecb(350, {error: "Password can't be empty"}, res);
        return;
    }
    m.findUpdate(models.User, {restore_code: data.restore_code}, {restore_code: null, password: md5(data.password)}, res, res, {publish: true})
};


/**
 * @api {post} /upload-profile Post data for upload profile
 * @apiName Upload profile
 * @apiGroup User
 *
 * @apiParam {String} email require
 * @apiParam {String} first_name
 * @apiParam {String} last_name
 *
 */
exports.upload_profile = function (req, res) {
    var params = m.getBody(req)
    m.findUpdate(models.User, {email: params.email}, params, res, res, {publish: "true"})
};


exports.linkedinSignin = function (req, res) {
    var user = req.body.user;
    User.findOne(
        {email: user.emailAddress},
        function (err, result) {
            if (err) return res.status(500).json(err);
            if (result) {
                if (result.favourites) delete result.favourites;

                var token = jwt.sign(result, self.config.secret, {expiresInMinutes: 11340});
                res.status(200).json({token: token});
                if (result.linkedinId === undefined) {
                    result.linkedinId = user.id;
                    result.save(err);
                }
            }
            else {
                user.email = user.emailAddress;
                delete user.emailAddress;
                user.dateOfJoin = new Date();
                user.isActive = 1;
                user.linkedinId = user.id;
                delete user.id;
                user.thumbnail = user.ppic = user.pictureUrl;
                delete user.pictureUrl;
                // create a new Media
                var newUser = models.User(user);

                // save the Media
                newUser.save(function (err) {
                    if (err) throw err;
                    user._id = newUser._id;
                    var token = jwt.sign(user, self.config.secret, {expiresInMinutes: 11340});
                    res.status(200).json({userId: newUser._id, token: token});
                    mkdirp('../public/images/users/' + newUser._id);
                });
            }
        }
    );
}


exports.googleSignin = function (req, res) {
    var user = req.body.user;
    models.User.findOne(
        {email: user.email},
        function (err, result) {
            if (err) return res.status(500).json(err);
            if (result) {
                if (result.favourites) delete result.favourites;

                var token = jwt.sign(result, self.config.secret, {expiresInMinutes: 11340});
                res.status(200).json({token: token});

                result.userAgent = req.headers['user-agent'];
                result.clientIPAddress = req.headers['x-forwarded-for'] || req.ip;


                if (result.googleId === undefined) {
                    result.googleId = user.id;
                    result.save(err);
                }
            }
            else {
                delete user.result;
                user.dateOfJoin = new Date();
                user.isActive = 1;
                delete user.verified_email;
                user.first_name = user.given_name;
                delete user.given_name;
                user.last_name = user.family_name;
                delete user.family_name;
                user.googleId = user.id;
                delete user.id;
                user.thumbnail = user.ppic = user.picture;
                delete user.picture;
                // create a new Media
                var newUser = models.User(user);

                // save the Media
                newUser.save(function (err) {
                    if (err) throw err;
                    user._id = newUser._id;
                    var token = jwt.sign(user, self.config.secret, {expiresInMinutes: 11340});
                    res.status(200).json({userId: newUser._id, token: token});
                    mkdirp('../public/images/users/' + newUser._id);
                });
            }
        }
    );
}

exports.facebookSignin = function (req, res) {
    var user = req.body.user;
    models.User.findOne(
        {email: user.email},
        function (err, result) {

            if (err) return res.status(500).json(err);
            if (result) {
                if (result.favourites) delete result.favourites;

                var token = jwt.sign(result, self.config.secret, {expiresInMinutes: 11340});
                res.status(200).json({token: token});

                result.userAgent = req.headers['user-agent'];
                result.clientIPAddress = req.headers['x-forwarded-for'] || req.ip;

                if (result.facebookId === undefined) {
                    result.facebookId = user.id;
                    result.save(err);
                }
            }
            else {
                user.isActive = 1;
                user.facebookId = user.id;
                delete user.id;
                user.thumbnail = user.ppic = user.picture;
                delete user.picture;
                // create a new Media
                var newUser = models.User(user);

                // save the Media
                newUser.save(function (err) {
                    if (err) throw err;
                    user._id = newUser._id;
                    var token = jwt.sign(user, self.config.secret, {expiresInMinutes: 11340});
                    res.status(200).json({userId: newUser._id, token: token});
                    mkdirp('../public/images/users/' + newUser._id);
                });
            }
        }
    );
}

exports.check_unique = function (req, res) {
    var username = req.query.username || '';
    models.User.count({username: username}).exec(function (err, count) {
        res.status(200).json({count: count});
    })

};

exports.check_unique_freelancer = function (req, res) {
    var name = req.query.name || '';
    models.Freelancer.count({name: name}).exec(function (err, count) {
        res.status(200).json({count: count});
    })

};


exports.get_user = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.Freelancer, {user: params.id}, res, res, {populate: 'user'})
};