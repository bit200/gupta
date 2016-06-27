var models = require('../db')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    _ = require('underscore'),
    mkdirp = require('mkdirp'),
    multer = require('multer'),
    async = require('async');

function pubParams(params, query) {
    params = params || {}
    var search = params.search
    var _query = query

    if (search) {
        var regexp = new RegExp(search, 'i')
        _query = {
            $and: [query, {
                $or: [{
                    title: regexp
                }, {
                    description: regexp
                }]
            }]
        }
    }

    var _params = {
        limit: params.limit || 20,
        skip: params.skip || 0
    }
    return {
        params: _params,
        query: _query,
        sort: '-created_at'
    }
}

exports.applyJob = function (req, res) {
    var params = m.getBody(req);
    console.log("apply for job", req.userId)
    var params = _.extend(params, {
        user: req.userId,
        freelancer: req.freelancerId
    })
    m.create(models.JobApply, params, res, res)
}


exports.applyJobUpdate = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.JobApply, {_id: params._id}, params, res, res)
}

exports.applyJobRemove = function (req, res) {
    var params = m.getBody(req);
    m.remove(models.JobApply, {_id: params._id}, res, res)
}

exports.getApplyInfo = function (req, res) {
    var params = m.getBody(req);
    console.log("paramsmsmsmsmsm", params)
    m.remove(models.JobApply, {job: params._id, freelancer: req.freelancerId}, res, res)
}

exports.getInfo = function (req, res) {
    m.find(models.Job, {_id: req.params._id}, res, res, {populate: 'user'})
}

exports.update = function (req, res) {
    var job = m.getBody(req)
    m.findUpdate(models.Job, {_id: job._id}, job, res, res)
}

exports.add_job = function (req, res) {
    var params = m.getBody(req);
    params.user = req.userId;
    params.status = 'open'
    m.create(models.Job, params, res, res)
};

exports.list = function (query) {
    return function (req, res) {
        var queryParams = m.getBody(req)
        var info = pubParams(queryParams, query)
        m.find(models.Job, info.query, res, res, info.params)
    }
};

exports.count = function (query) {
    return function (req, res) {
        var queryParams = m.getBody(req)
        var info = pubParams(queryParams, query)
        console.log("info", info, info.params)
        m.count(models.Job, info.query, res, res, info.params)
    }
};


exports.get_job = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.Job, params, res, res)
};

exports.get_my_job = function (req, res) {
    m.find(models.Job, {user: req.userId}, res, res, {populate: 'user contract'})
};