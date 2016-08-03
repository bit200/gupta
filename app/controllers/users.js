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

exports.list = function (req, res) {
    var params = m.getBody(req);
    m.find(models.User, {}, res, res, params)
};

exports.me_ids = function (req, res) {
    res.send({
        userId: req.userId,
        freelancerId: req.freelancerId
    })
}


exports.me = function (req, res) {
    m.findOne(models.User, {_id: req.userId}, res, res, {publish: true, populate: {path: 'poster'}})
};

exports.first_signIn = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.User, {_id: params.userId}, {first_singin: 0}, res, res)
};

exports.update_password = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.User, {_id: params.userId || req.userId}, res, function (user) {
        user.comparePassword(params.oldPassword, function (err, isMatch) {
            if (err || !isMatch) {
                return m.ecb(401, err, res)
            }
            m.findUpdate(models.User, {_id: params.userId || req.userId}, {password: md5(params.newPassword), first_singin: 0}, res, res)
        });
    })
};

exports.send_confirm = function (req, res) {
    var login = m.getBody(req).login;
    m.findOne(models.User, {
        $or: [
            {email: login}
        ]
    }, res, function (user) {
        mail.send_confirm(user, res, res)
    })
};

exports.send_restore = function (req, res) {
    var email = m.getBody(req).email;
    m.findOne(models.User, {email: email}, res, function (user) {
        user.send_restore(res, res)
    })
};

exports.confirm = function (req, res) {
    var code = m.getBody(req).confirm_code;
    m.findOne(models.User, {confirm_code: code}, res, function (user) {
        user.confirm_code = true;
        m.save(user, res, function () {
            m.createToken(models, user, res, res)
        }, {publish: true})
    })
};

exports.restore = function (req, res) {
    var data = m.getBody(req);
    if (!data.password) {
        m.ecb(350, {error: "Password can't be empty"}, res);
        return;
    }
    m.findUpdate(models.User, {restore_code: data.restore_code}, {restore_code: null, password: data.password}, res, res, {publish: true})
};

exports.update_profile = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.User, {_id: req.userId}, params, res, res, {publish: true})
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
};

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
};

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
};

exports.check_unique = function (req, res) {
    var q = {}
    var key = Object.keys(req.query)[0]
    q[key] = new RegExp(req.query[key])
    models.User.count(q).exec(function (err, count) {
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

exports.create_test_user = function (req, res) {
      var arrF = [];
    arrF.push(function (cb) {
        var user = {
            "first_name": "Sqall0",
            "last_name": "Leonhart0",
            "company_name": "Tes0t"
        };
        user._id = 100;
        user.email = "jig234asan7000000@gmail.com";
        m.create(models.User, user,function(err,text){log('1',err, text);cb()}, function(user){log('1',user._id);cb()})
    });
    arrF.push(function (cb) {
        var user = {
            "first_name": "Sqall1",
            "last_name": "Leonhart1",
            "company_name": "Te1st"
        };
        user._id = 101;
        user.email = "jiga546san7000001@gmail.com";
        m.create(models.User, user, function(err,text){cb();log('2',err, text)}, function(user){log('2',user._id);cb()})
    });
    arrF.push(function (cb) {
        var user = {
            "first_name": "Sqall2",
            "last_name": "Leonhart2",
            "company_name": "Test",
        };
        user._id = 102;
        user.email = "jiga73san7000002@gmail.com";
        m.create(models.User, user, function(err){log('3',err);cb()}, function(user){log('3',user._id);cb()})
    });
    arrF.push(function (cb) {
        var user = {
            "first_name": "Sqall3",
            "last_name": "Leonhart3",
            "company_name": "Te3st",
        };
        user._id = 103;
        user.email = "jigaertysan7000003@gmail.com";
        m.create(models.User, user, function(err){log('4',err);cb()}, function(user){log('4',user._id);cb()})
    });
    arrF.push(function (cb) {
        var user = {
            "first_name": "Sqall4",
            "last_name": "Leonh4art",
            "company_name": "Te4st",
        };
        user._id = 104;
        user.email = "jigasahdfghn7000004@gmail.com";
        m.create(models.User, user, function(err){log('5',err);cb()}, function(user){log('5',user._id);cb()})
    });
    arrF.push(function (cb) {
        var user = {
            "first_name": "Sqal5l",
            "last_name": "Leon5hart",
            "company_name": "Tes5t",
        };
        user._id = 105;
        user.email = "jigasacvbnn7000005@gmail.com";
        m.create(models.User, user, function(err){log('6',err);cb()}, function(user){log('6',user._id);cb()})
    });
    arrF.push(function (cb) {
        var user = {
            "first_name": "Sqal66l",
            "last_name": "Leonha6rt",
            "company_name": "Tes6t",
        };
        user._id = 106;
        user.email = "jigasasdfgn7000006@gmail.com";
        m.create(models.User, user, function(err){log('7',err);cb()}, function(user){log('7',user._id);cb()})
    });
    arrF.push(function (cb) {
        var user = {
            "first_name": "Sqal7l",
            "last_name": "Leonh7art",
            "company_name": "Te7st",
        };
        user._id = 107;
        user.email = "jighgjkasan7000007@gmail.com";
        m.create(models.User, user, function(err){log('8',err);cb()}, function(user){log('8',user._id);cb()})
    });
    async.series(arrF, function (e, r) {
        m.scb('ok', res)
    });
};