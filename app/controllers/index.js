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

exports.common_filters = function (req, res) {
    models.Filters.find().lean().exec(function(err, filters){
        var resObj = _.groupBy(filters, 'type');
        _.each(resObj, function(value,key){
            var tArr = _.groupBy(value, 'filter');
            resObj[key] = [];
            _.each(tArr, function(v, k){
                if (!k){
                    resObj[key] = resObj[key].concat(v)
                }else{
                    resObj[key].push({
                        subFilter: k,
                        arr: v
                    });
                }
            })
        });
        res.jsonp(resObj)
    });
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

exports.search = function (req, res) {
    var result = {};
    async.parallel([
        function(cb){
            models.Filters.find({name: new RegExp(req.query.query, "i")}).exec(function(err, filters){
                result.filters = _.map(filters,function(item){
                    return {
                      displayTitle: item.type + ' - ' + item.name,
                      filter_name: item.name,
                      service_provider: item.type,
                      filter_type: item.filter,
                      type: 'filters'
                    }
                });
                cb();
            })
        },
        function(cb){
            models.ServiceProvider.find({name: new RegExp(req.query.query, "i")}).distinct('name', function(err, services){
                result.services = _.map(services,function(item){
                    return {
                      displayTitle: item,
                      type: 'service_providers'
                    }
                });
                cb();
            })
        },
        function(cb){
            models.Freelancer.find({name: new RegExp(req.query.query, "i")}).select('name').limit(5).exec(function(err, freelancers){
                result.freelancers = _.map(freelancers,function(item){
                  return {
                      _id: item._id,
                      displayTitle: item.name,
                      type: 'freelancers'
                  }
                });
                cb();
            })
        },
        function(cb){
            models.Job.find({title: new RegExp(req.query.query, "i")}).select('title').limit(5).exec(function(err, jobs){
                result.jobs = _.map(jobs,function(item){
                    return {
                        _id: item._id,
                        displayTitle: item.title,
                        type: 'jobs'
                    }
                });
                cb();
            })
        }
    ], function(){
        res.jsonp(result)
    })
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
