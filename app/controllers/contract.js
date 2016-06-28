var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , mail = require('../mail')
    , _ = require('underscore');


exports.create_contract = function (req, res) {
    var params = m.getBody(req);
    console.log("params", params, req.userId)
    params.buyer = req.userId
    m.create(models.Contract, {buyer: req.userId, seller: params.id}, res, res)
};

exports.approve_contract = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Contract, {_id: params._id, seller: req.userId}, {status: 'approve'}, res, function (contract) {
        m.findUpdate(models.Job, {contract: contract._id}, {status: 'applied'}, res, function () {
            mail.invitePayment(contract.buyer, res, m.scb(contract))
        })
    }, {populate: 'buyer'})

};

exports.update_contract = function (req, res) {
var params = m.getBody(req);
    var id = params._id;
    delete params._id;
    m.findUpdate(models.Contract, {_id: id, buyer: req.userId}, params, res, function (contract) {
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

exports.close_contract = function (req, res) {
    var params = m.getBody(req);
    delete params._id;
    m.findUpdate(models.Contract, {_id: params.id, buyer: req.userId}, {status: 'close'}, res, function (contract) {
        m.findUpdate(models.Job, {contract: contract._id}, {status: 'closed'}, res, function (job) {
            params.job = job._id;
            m.create(models.Comments, params, res, function(){
                mail.contractClose(contract.seller, contract._id,  params.closure, res, m.scb(contract, res))
            })
        })
    }, {populate: 'seller'})
};

exports.suggest_contract_apply = function (req, res) {
    var params = m.getBody(req);
    delete params.suggest._id;
    var item = _.extend(params.suggest.contract, params.suggest);
    m.findUpdate(models.Contract, {_id: params.suggest.contract._id, buyer: req.userId}, item, res, function (contract) {
        m.findOne(models.Job, {contract: contract._id}, res, function () {
            mail.suggestApply(contract.seller, contract._id, res, m.scb(contract, res))
        })
    }, {populate: 'seller'})
};

exports.suggest_contract_cancel = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.SuggestContract, {_id: params.id}, res, function () {
        m.findOne(models.Contract, {_id: params.id, buyer: req.userId}, res, function (contract) {
            mail.suggestCancel(contract.seller, contract._id, res, m.scb(contract, res))
        }, {populate: 'seller'})
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


exports.get_suggest = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.SuggestContract, {_id: params._id}, res, res, {populate: 'contract'})
};