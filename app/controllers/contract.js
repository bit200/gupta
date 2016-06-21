var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , mail = require('../mail')
    , _ = require('underscore')


exports.create_contract = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.User, {_id: req.userId}, res, function (user) {
        m.create(models.Contract, {buyer_email: user.email, seller_email: params.email}, res, res)
    })
};
exports.approve_contract = function (req, res) {
    var params = m.getBody(req);

    m.findUpdate(models.Contract, {_id: params._id}, {status: 'approve'}, res, res)
};

exports.update_contract = function (req, res) {
    var params = m.getBody(req);
    var id = params._id;
    delete params._id;
    m.findOne(models.User, {email: params.seller_email}, res, function (user) {
        m.findUpdate(models.Contract, {_id: id}, params, res, function (contract) {
            mail.contractCreate(user, contract._id, res, m.scb(contract, res))
        })
    })
};

exports.delete_contract = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.Contract, {_id: params._id}, res, res)
};

exports.reject_contract = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.User, {email: params.seller_email}, res, function (user) {
        m.findUpdate(models.Contract, {_id: params._id}, {status: 'reject', reject_reason: params.reject_reason}, res, function (contract) {
            mail.contractReject(user, contract._id, params.text, res, m.scb(contract, res))
        })
    })
};

exports.suggest_contract = function (req, res) {
    var params = m.getBody(req);
    delete params._id;
    m.findOne(models.User, {email: params.seller_email}, res, function (user) {
        m.create(models.SuggestContract, params, res, function (suggest) {
            mail.contractSuggest(user, suggest.contract, suggest._id, res, m.scb(suggest, res))
        })
    })
};


exports.get_contract = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.Contract, {_id: params._id}, res, res)
};