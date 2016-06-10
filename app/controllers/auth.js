var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , md5 = require('md5')
    , redis = require('../redis')
    , mail = require('../mail')
    , User = models.User
    , AccessToken = models.AccessToken
    , RefreshToken = models.RefreshToken;

exports.doc = function (req, res) {
    res.render('index')
};


exports.test = function (req, res) {
    m.find(User, {}, res, res)
};


/**
 * @api {get} /generate-admin Created admin with default password
 * @apiName Generate admin
 * @apiGroup Auth
 *
 */
exports.generate_admin = function (req, res) {
    var password = md5('b8KuBSaqx5EuG');
    m.findCreateUpdate(User, {
        role: 'ADMIN',
        username: 'admin',
        email: 'admin@example.com'
    }, {
        password: password
    }, res, res, {publish: true})
};


/**
 * @api {get} /tokens Get tokens list
 * @apiName Tokens list
 * @apiGroup Auth
 *
 * @apiPermission Admin
 *
 */
exports.tokens_list = function (req, res) {
    redis.keys("token_*", function (err, arr) {
        if (err) {
            m.res_send(405, 'Redis error', res)
        } else {
            m.res_send(200, arr, res)
        }
    })

};


/**
 * @api {get} /sign-in Sign in and get token
 * @apiName Sign in
 * @apiGroup Auth
 *
 * @apiParam {String} login Username or Email
 * @apiParam {String} password
 */
exports.sign_in = function (req, res) {
    var params = m.getBody(req);
    m.findOne(User, {$or: [
        {username: params.login},
        {email: params.login}
    ]}, res, function (user) {
        user.comparePassword(params.password, function (err, isMatch) {
            if (err || !isMatch) {
                return m.ecb(401, err, res)
            }
            m.createToken(models, user, res, res)
        });
    })
};


/**
 * @api {post} /sign-up Register a new user
 * @apiName Sign up
 * @apiGroup Auth
 *
 * @apiParam {String} username
 * @apiParam {String} first_name
 * @apiParam {String} last_name
 * @apiParam {String} password
 * @apiParam {String} email
 *
 */
exports.sign_up = function (req, res) {
    var params = req.body;
    if (params.password) {
        params.password = md5(params.password);
    }
    m.create(User, params, res, function (user) {
        mail.send_confirm(user);
        m.scb(user.publish(), res);
//        mkdirp('../../public/img/user'+user._id);
    })
};


/**
 * @api {get} /refresh-token Refresh token
 * @apiName Refresh token
 * @apiGroup Auth
 *
 * @apiParam {String} refresh_token
 *
 */
exports.refresh_token = function (req, res) {
    var token = m.getBody(req).refresh_token;
    m.findOne(RefreshToken, {value: token}, res, function (refreshToken) {
        m.findCreate(AccessToken, {
            user: refreshToken.user,
            role: refreshToken.role
        }, {}, res, res, {publish: true})
    })
};

