var redis = require('../../redis');
var config = require('../../../app/config');
var models = require('../../db');
var m = require('../../m');
function check_auth (req, res, next, role) {
    var _token = req.headers['authorization']
    if (!_token) {
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });
    }
    res._token_start_time = new Date().getTime();

    redis.get('token_' + _token, function(err, r){
        if (err || !r) {
            return res.status(402).send({
                success: false,
                message: "Failed to authenticate the token."
            });
        }
        var arr = r.split('_')

        req.token = _token;
        req.userId = arr[0];
        res._token_end_time = new Date().getTime();
        next()
    })
}

module.exports = {
    checkIfUser: function (req, res, next) {
        var _token = req.headers['authorization']
        if (!_token) return next();
        redis.get('token_' + _token, function(err, r){
            if (err || !r) return next();
            var arr = r.split('_')
            req.token = _token;
            req.userId = arr[0];
            req.userRole = arr[1];
            res._token_end_time = new Date().getTime();
            next();
        })
    },
    token: function (req, res, next) {
        check_auth(req, res, next, 'user')
    },
    freelancer_token: function(req, res, next) {
        check_auth(req, res, function(){
            m.findOne(models.Freelancer, {user: req.userId}, function() {
                res.status(403).send({
                    success: false,
                    message: ["Permission error. You need to login as a freelancer"].join('')
                })
            }, function(freelancer){
                req.freelancerId = freelancer._id
                req.freelancer = freelancer
                next()    
            })
            
        })
    },
    admin_only: function (req, res, next) {
        check_auth(req, res, next, 'admin')
    }
};
