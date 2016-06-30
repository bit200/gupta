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


exports.fn = function (url, auth, modelName, middleware, extra_params, app) {
    var theInstructions = 'return ' + middleware;
    var middlewareFn = new Function(theInstructions);

    if (auth) {
        app.get(url, auth, routing('find'))
        app.get(url + 'count', auth, routing('count'))
    } else {
        app.get(url, routing('find'))
        app.get(url + 'count', routing('count'))
    }

    function routing (type) {
        return function (req, res) {
            var queryParams = m.getBody(req)
            var query = middlewareFn.call(req)
            var info = pubParams(queryParams, query)
            console.log('infofofofofo', info, query)
            info.params.populate = extra_params.populate || ''
            info.params.sort = extra_params.sort || info.params.sort || ''

            m[type](models[modelName], info.query, res, res, info.params)
        }
    }
}

exports.get_info = function (req, res) {
    var params = req.params
    m.findOne(models[params.model], {_id: params._id}, res, res)
}
exports.applyJob = function (req, res) {
    var params = _.extend(m.getBody(req), {
        seller: req.userId,
        freelancer: req.freelancerId
    })
    console.log('paramsssssssssss', params)
    m.findOne(models.Job, {_id: params.job}, res, function(job){
        params.buyer = job.user
        console.log('hahahahahhahaha', job)
        m.findCreateUpdate(models.JobApply, {
            job: job._id,
            freelancer: params.freelancer,
            seller: params.seller
        }, params, res, res)
    })

}

exports.applyJobUpdate = function (req, res) {
    var params = m.getBody(req);
    var query = {
        seller: req.userId,
        freelancer: req.freelancerId,
        job: params.job
    }
    console.log("cchchchchchch", query, params)
    m.findUpdate2(models.JobApply, query, {message: params.message}, res, res, params)
}


exports.job_stats = function (req, res) {
    var _id = req.params._id
    async.parallel({
        applicants: function (cb) {
            models.JobApply.count({job: _id}).exec(cb)
        },
        interviews: function (cb) {
            models.ChatRoom.count({job: _id}).exec(cb)
        },
        hired: function (cb) {
            models.Contract.count({job: _id}).exec(cb)
        }
    }, function (err, data) {
        res.send({
            err: err,
            data: data
        })
    })
}

exports.list = function (query) {
    return function (req, res) {
        var queryParams = m.getBody(req)
        var info = pubParams(queryParams, query)
        info.params.populate = 'user'
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

exports.buyer_open = function (req, res) {
    var queryParams = m.getBody(req)
    var info = pubParams(queryParams, {buyer: req.userId})
    info.params.populate = 'job freelancer'
    console.log("infofofofofo", info)
    m.find(models.JobApply, info.query, res, res, info.params)

}

exports.count = function (query) {
    return function (req, res) {
        var queryParams = m.getBody(req)
        var info = pubParams(queryParams, query)
        console.log("info", info, info.params)
        m.count(models.Job, info.query, res, res, info.params)
    }
};

exports.buyer_open = function (req, res) {
    var queryParams = m.getBody(req)
    var info = pubParams(queryParams, {buyer: req.userId})
    info.params.populate = 'job freelancer'
    console.log("infofofofofo", info)
    m.find(models.JobApply, info.query, res, res, info.params)

}

exports.rejectJobApply = function (req, res) {
    res.send("rejected")
}
exports.buyer_open_count = function (req, res) {
    var queryParams = m.getBody(req)
    var info = pubParams(queryParams, {buyer: req.userId})
    m.count(models.JobApply, info.query, res, res, info.params)
}

exports.seller_open = function (req, res) {
    var queryParams = m.getBody(req)
    var info = pubParams(queryParams, {seller: req.userId})
    info.params.populate = 'job freelancer buyer'
    console.log('infofofofofof', info)
    m.find(models.JobApply, info.query, res, res, info.params)

}
exports.seller_open_count = function (req, res) {
    var queryParams = m.getBody(req)
    var info = pubParams(queryParams, {seller: req.userId})
    m.count(models.JobApply, info.query, res, res, info.params)
}


exports.applyJobRemove = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.JobApply, {_id: params._id}, res, res)
}
exports.apply_detailed_pub = function(req, res) {
    m.findOne(models.JobApply, {_id: req.params._id}, res, res, {populate: 'buyer job seller freelancer'})
}
exports.getApplyInfo = function (req, res) {
    var params = m.getBody(req);
    console.log("paramsmsmsmsmsm", params)
    m.find(models.JobApply, {job: req.params.job_id, freelancer: req.freelancerId}, res, res)
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


exports.get_job = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.Job, params, res, res)
};

exports.get_my_job = function (req, res) {
    m.find(models.Job, {user: req.userId}, res, res, {populate: 'user contract'})
};