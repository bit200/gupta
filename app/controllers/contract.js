var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , _ = require('underscore')


exports.create_contract = function (req, res) {
    m.create(models.Contract, {}, res, res)
};
exports.update_contract = function (req, res) {
    var params = m.getBody(req);
    var id = params._id;
    delete params._id;
    m.findUpdate(models.Contract, {_id: id}, params, res, res)
};

exports.delete_contract = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.Contract, {_id: params._id}, res ,res)
};