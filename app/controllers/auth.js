var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , md5 = require('md5')
    , redis = require('../redis')
    , mail = require('../mail')
    , Admin = models.Admin
    , User = models.User
    , AccessToken = models.AccessToken
    , RefreshToken = models.RefreshToken
    , mkdirp = require('mkdirp');


exports.doc = function (req, res) {
    res.render('index')
};


exports.tokens_list = function (req, res) {
    redis.keys("token_*", function (err, arr) {
        if (err) {
            m.res_send(405, 'Redis error', res)
        } else {
            m.res_send(200, arr, res)
        }
    })

};

exports.sign_in = function (req, res) {
    var params = m.getBody(req);
    m.findOne(User, {email: params.login}, res, function (user) {
        user.comparePassword(params.password, function (err, isMatch) {
            if (err || !isMatch) {
                return m.ecb(401, err, res)
            }
            m.createToken(models, user, res, res)
        });
    })
};


exports.sign_up = function (req, res) {
    var params = req.body;
    if (params.password) params.password = md5(params.password);
    m.create(User, params, res, function (user) {
        mkdirp(config.root + "/public/uploads/" + user._id.toString(), function (err) {
            if (err) console.log(err);
            else {
                console.log('Directory create!');
            }
        });
        mail.send_confirm(user);
        m.createToken(models, user, res, res)
    })
};


exports.refresh_token = function (req, res) {
    var token = m.getBody(req).refresh_token;
    m.findOne(RefreshToken, {value: token}, res, function (refreshToken) {
        m.findCreate(AccessToken, {
            user: refreshToken.user,
            role: refreshToken.role
        }, {}, res, res, {publish: true})
    })
};

