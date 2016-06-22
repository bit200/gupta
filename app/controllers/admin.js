var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , mail = require('../mail')
    , md5 = require('md5')
    , randomstring = require('randomstring')
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

exports.approve_job = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Job, {_id: params._id}, {admin_approved: 1}, res, function(job){
        m.findOne(models.User, {_id: job.user}, res, function(user){
            mail.job_approve(user, res, m.scb(job,res))
        })
    })
};

exports.reject_job = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Job, {_id: params._id}, {admin_approved: 2, reject_reason:params.reject_reason}, res, function(job){
        m.findOne(models.User, {_id: job.user}, res, function(user){
            mail.job_reject(user, res, params.reject_reason, m.scb(job,res))
        })
    })
};

exports.suggest_edit_job = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Job, {_id: params._id}, {admin_approved: 3, reject_reason:params.reject_reason}, res, function(job){
        log(job)
        m.findOne(models.User, {_id: job.user}, res, function(user){
            mail.job_edit(user, params.reject_reason, params._id, res, m.scb(job,res))
        })
    })
};

exports.approved = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.User, {username: params.username}, {admin_approved: 1}, res, function(user){
        var newseller = {
            login: randomstring.generate(10),
            password: randomstring.generate(15)
        };
    })
};

exports.reject = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.User, {username: params.username}, {admin_approved: 2, reject_reason: params.reject_reason}, res, res)
};