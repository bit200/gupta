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

m.create(models.Client, {name:'coca-cola'});
exports.get_content = function (req, res) {
    var params = m.getBody(req);
    m.distinct(models[params.name], JSON.parse(params.query), params.distinctName, res, res)
};

exports.get_client = function (req, res) {
    m.find(models.Client, {}, res, res)
};


exports.get_agency = function (req, res) {
    async.waterfall([
        function(cb){
            if (!req.userId) return cb(null, [])
            models.BusinessUser.find({user: req.userId}).exec(function(err, businessUsers){
                cb(null,_.map(businessUsers, function(businessUser){
                    return businessUser.agency
                }))
            });
        },
        function(linkedAgencies, cb){
            models.Freelancer.find({type: 'agency'}).populate('poster contact_detail').exec(function(err, freelancers){
                res.json({
                    linkedAgencies: linkedAgencies || [],
                    agencies: freelancers
                });
                cb()
            });
        }
    ]);
};

exports.request_business = function (req, res) {
    // var params = m.getBody(req);
    // m.findOne(models.Agency, {name: params.agency}, res, function (agency) {
    //     params.data.agency = agency._id;
    //     m.findOne(models.BusinessUser, {agency: agency._id, email: params.data.email}, function (err) {
    //         m.create(models.BusinessUser, params.data, res, function (data) {
    //             m.create(models.UserClaimAgency, {agency: agency.name, user: req.userId}, res, m.scb(data, res))
    //         });
    //     }, function () {
    //         m.scb('find', res)
    //     })
    // })
};
