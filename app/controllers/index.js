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
    res.render('admin/index')
};

exports.get_content = function (req, res) {
    var params = m.getBody(req);
    m.distinct(models[params.name], JSON.parse(params.query), params.distinctName, res, res)
};

exports.get_filters = function (req, res) {
    m.find(models.Filters, {}, res, function (Arr) {
        var arr = []
        _.each(Arr, function (item) {
            //Create obj by type service provider
            if (checkObj(arr, item.type) < 0) {
                var obj = {};
                obj[item.type] = {arr: []};
                arr.push(obj)
            }
            //Create obj if type have filter
            if (item.filter) {
                if (!_.has(arr[checkObj(arr, item.type)][item.type], item.filter)) {
                    var obj = {};
                    arr[checkObj(arr, item.type)][item.type][item.filter] = {arr: []};
                }

                if (item.isActive) {
                    arr[checkObj(arr, item.type)][item.type][item.filter].arr.push(item.name)
                }
            } else {
                if (item.isActive) {
                    arr[checkObj(arr, item.type)][item.type].arr.push(item.name)
                }
            }
        });
        m.scb(arr, res)
    })
};

function checkObj(arr, objName) {
    var result = -1;

    _.each(arr, function (obj, i) {
        if (_.has(obj, objName)) {
            result = i

        }
    });

    return result;
}

exports.get_client = function (req, res) {
    m.find(models.Client, {}, res, res)
};


exports.get_agency = function (req, res) {
    async.waterfall([
        function (cb) {
            if (!req.userId) return cb(null, [])
            models.BusinessUser.find({user: req.userId}).exec(function (err, businessUsers) {
                cb(null, _.map(businessUsers, function (businessUser) {
                    return businessUser.agency
                }))
            });
        },
        function (linkedAgencies, cb) {
            models.Freelancer.find({type: 'agency'}).populate('poster contact_detail').exec(function (err, freelancers) {
                res.json({
                    linkedAgencies: linkedAgencies || [],
                    agencies: freelancers
                });
                cb()
            });
        }
    ]);
};
