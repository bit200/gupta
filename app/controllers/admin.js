var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , md5 = require('md5')
    , _ = require('underscore');


exports.generate_admin = function (req, res) {
    var password = md5('b8KuBSaqx5EuG');
    m.findCreateUpdate(models.User, {
        role: 'ADMIN',
        username: 'admin',
        email: 'admin@example.com'
    }, {
        password: password
    }, res, res, {publish: true})
};


exports.get_users = function (req, res) {
    m.find(models.User, {}, res, res)
};

exports.get_business_users = function (req, res) {
    m.find(models.BusinessUser, {}, res, res, {populate: 'agency'})
};

exports.get_job = function (req, res) {
    m.find(models.Job, {}, res, res)
};


exports.approve_agency = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.BusinessUser, {email: params.email}, {isActive: true}, res, res)
};

exports.reject_agency = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.BusinessUser, {email: params.email}, {isActive: false}, res, res)
};

exports.approved = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.User, {username: params.username}, {admin_approved: 1}, res, res)
};


exports.reject = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.User, {username: params.username}, {admin_approved: 2, reject_reason: params.reject_reason}, res, res)
};