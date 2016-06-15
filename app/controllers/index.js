var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , _ = require('underscore')
    , fs = require('fs')
    , async = require('async')
    , path = require('path');


exports.index = function (req, res) {
    res.render('src')
};
exports.admin = function (req, res) {
    res.render('admin/admin-index')
};

exports.get_content = function (req, res) {
    var params = m.getBody(req);
    m.distinct(models[params.name], JSON.parse(params.query), params.distinctName, res, res)
};


exports.get_agency = function (req, res) {
    var params = m.getBody(req);
    var arrfunc = [];
    m.find(models.Agency, {}, res, function (agency) {
        m.distinct(models.UserClaimAgency, {user: req.userId}, 'agency', res, function (arr) {
            _.forEach(agency, function (item) {
                arrfunc.push(function (cb) {
                    item.status = _.flatten(arr).indexOf(item.name) > -1;
                    cb()
                })
            });
            async.parallel(arrfunc, function (e, r) {
                m.scb(agency, res)
            })
        })
    })
};

exports.request_business = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.Agency, {name: params.agency}, res, function (agency) {
        params.data.agency = agency._id;
        m.findOne(models.BusinessUser, {agency: agency._id, email: params.data.email}, function (err) {
            m.create(models.BusinessUser, params.data, res, function (data) {
                m.create(models.UserClaimAgency, {agency: agency.name, user: req.userId}, res, m.scb(data, res))
            });
        }, function () {
            m.scb('find', res)
        })
    })
};
