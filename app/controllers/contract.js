var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , mail = require('../mail')
    , _ = require('underscore');


exports.create_contract = function (req, res) {
    var params = m.getBody(req);
    m.create(models.Contract, {buyer: req.userId, seller: params.id}, res, res)

};

exports.approve_contract = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Contract, {_id: params._id, seller: req.userId}, {status: 'approve'}, res, res)

};

exports.update_contract = function (req, res) {
    var params = m.getBody(req);
    var id = params._id;
    delete params._id;
    m.findUpdate(models.Contract, {_id: id, buyer: req.userId}, params, res, function (contract) {
        log(JSON.stringify(contract,null, 2))
        mail.contractCreate(contract.seller, contract._id, res, m.scb(contract, res))
    }, {populate: 'seller'})
};

exports.delete_contract = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.Contract, {_id: params._id, buyer: req.userId}, res, res)
};

exports.reject_contract = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Contract, {_id: params._id, seller: req.userId}, {status: 'reject', reject_reason: params.reject_reason}, res, function (contract) {
        mail.contractReject(contract.seller, contract._id, params.text, res, m.scb(contract, res))
    }, {populate: 'seller'})

};

exports.suggest_contract = function (req, res) {
    var params = m.getBody(req);
    delete params._id;
    m.create(models.SuggestContract, params, res, function (suggest) {
        m.findOne(models.User, {_id: req.userId}, res, function (user) {
            mail.contractSuggest(user, suggest.contract, suggest._id, res, m.scb(suggest, res))
        })
    })
};


exports.get_contract = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.Contract, {
        _id: params._id, $or: [
            {seller: req.userId},
            {buyer: req.userId}
        ]
    }, res, res)
};