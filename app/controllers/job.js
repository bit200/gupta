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
        limit: params.limit || 12,
        skip: params.skip || 0
    }
    return {
        params: _params,
        query: _query,
        sort: '-created_at'
    }
}
exports.job_detailed = function (req, res) {
    m.findOne(models.Job, {_id: req.params._id}, res, res, {populate: 'buyer job seller freelancer'})
}


exports.fn = function (url, auth, modelName, middleware, extra_params, app) {
    var theInstructions = 'return ' + middleware;
    var middlewareFn = new Function(theInstructions);

    if (auth) {
        app.get(url, auth, routing('find'))
        app.get(url + '/count', auth, routing('count'))
    } else {
        app.get(url, routing('find'))
        app.get(url + '/count', routing('count'))
    }


    function routing(type) {

        return function (req, res) {

            var queryParams = m.getBody(req);
            var query = middlewareFn.call(req);
            var info = pubParams(queryParams, query);
            console.log('routing', queryParams, query)

            info.params.populate = extra_params.populate || '';
            info.params.sort = extra_params.sort || info.params.sort || '';

            m[type](models[modelName], info.query, res, res, info.params)
        }
    }
};

exports.get_info = function (req, res) {
    var params = req.params;
    m.findOne(models[params.model], {_id: params._id}, res, res)
};

exports.filter_job = function (req, res) {
    var params = m.getBody(req);
    if (params.search)
        var re = new RegExp(params.search, 'i');

    params.status = params.status || 'All';

    var modelFind = (params.status == 'Open') ? 'JobApply' : 'Contract',
        category = {};
    if (params.status == 'All'){
        modelFind = 'Job';
    }
    
    switch(modelFind){
        case 'JobApply': category.message = re;break;
        case 'Contract': category.$or = [{title: re}, {information: re}, {seller_name: re}, {buyer_name: re}];break;
        case 'Job': category.$or = [{title: re}, {description: re}, {type_category: re}, {type_filter: re}, {type_name:re}];break;
    }

    if (params.category)
        category.type_category = params.category;
    if (params.sub_category)
        category.type_filter = params.sub_category;
    if (params.sub_sub_category)
        category.type_name = params.sub_sub_category;
    if (params.budget_min && params.budget_max)
        category.budget = {'$gte': params.budget_min, '$lte': params.budget_max};
    if (modelFind == 'Contract' && params.status == 'Ongoing')
        category.status = ["Ongoing", "Marked as completed", "Paused"]
    if (modelFind == 'Contract' && params.status == 'Close')
        category.status = ["Closed"];

    m.find(models[modelFind], category, res, function (jobs) {
        m.scb(jobs, res)
    }, {populate: 'job freelancer buyer contract', sort: '-created_at'})
};


exports.applyJob = function (req, res) {
    var params = _.extend(m.getBody(req), {
        seller: req.userId,
        freelancer: req.freelancerId
    })
    // console.log('paramsssssssssss', params)
    m.findOne(models.Job, {_id: params.job}, res, function (job) {
        params.buyer = job.user
        // console.log('hahahahahhahaha', job)
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
    // console.log("cchchchchchch", query, params)
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
        contracts: function (cb) {
            models.Contract.count({status: {$nin: ["Rejected by seller", "Rejected by buyer"]}, job: _id}).exec(cb)
        },
        hired: function (cb) {
            models.Contract.count({status: {$in: ["Ongoing", "Closed"]}, job: _id}).exec(cb)
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
        info.params.populate = 'user';
        m.find(models.Job, info.query, res, res, info.params)
    }
};

exports.count = function (query) {
    return function (req, res) {
        var queryParams = m.getBody(req)
        var info = pubParams(queryParams, query)
        // console.log("info", info, info.params)
        m.count(models.Job, info.query, res, res, info.params)
    }
};

exports.buyer_open = function (req, res) {
    var queryParams = m.getBody(req)
    var info = pubParams(queryParams, {buyer: req.userId})
    info.params.populate = 'job freelancer'
    // console.log("infofofofofo", info)
    m.find(models.JobApply, info.query, res, res, info.params)

}

exports.count = function (query) {
    return function (req, res) {
        var queryParams = m.getBody(req)
        var info = pubParams(queryParams, query)
        // console.log("info", info, info.params)
        m.count(models.Job, info.query, res, res, info.params)
    }
};

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
    // console.log('infofofofofof', info)
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

exports.apply_detailed_pub = function (req, res) {
    m.findOneOwner(models.JobApply, {_id: req.params.apply_id}, res, res, {
        req: req,
        userId: req.userId,
        populate: 'buyer job seller freelancer'
    })
}
exports.getApplyInfo = function (req, res) {
    var params = m.getBody(req);
    m.findOneEmpty(models.JobApply, {job: req.params.job_id, freelancer: req.freelancerId}, res, res)
}

exports.getInfo = function (req, res) {
    m.find(models.Job, {_id: req.params._id}, res, res, {populate: 'user'})
}

exports.update = function (req, res) {
    var job = m.getBody(req)
    console.log("jobbbbbbbbbbbbbb", job, req.userId)
    m.findUpdate(models.Job, {user: req.userId, _id: job._id}, job, res, res, {req: req})
}

exports.add_job = function (req, res) {
    var params = m.getBody(req);
    params.user = req.userId;
    params.buyer = req.userId;
    params.status = 'open';

    if (params._id) {
        m.findUpdate(models.Job, {_id: params._id}, params, res, res)
    } else {
        delete params._id;
        delete params.created_at;
        delete params.suggest;
        delete params.contract;
        m.create(models.Job, params, res, res)
    }
};


exports.get_job = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.Job, params, res, res)
};

exports.get_my_job = function (req, res) {
    m.find(models.Job, {user: req.userId}, res, res, {populate: 'user contract'})
};

exports.job_attach_file = function (req, res) {
    var attachment;
    var params = m.getBody(req);
    log('sdkhskkfhaslkh', params)
    m.findCreate(models.Job, params.id, {}, res, function (job) {
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                var path = config.root + '/public/uploads/job/' + job._id;
                mkdirp.sync(path);
                cb(null, path)

            },
            filename: function (req, file, cb) {
                var name = new Date().getTime() + '_' + file.originalname;
                cb(null, name)
            }
        });

        var upload = multer({
            storage: storage
        }).any();
        upload(req, res, function (err) {
            async.forEach(req.files, function (file, cb) {
                new models.Attachment({
                    originalName: file.originalname,
                    name: file.filename,
                    path: 'job/' + job._id
                }).save(function (err, attach) {
                    attachment = attach;
                    m.scb({file: attach, job: job._id}, res);
                    cb();
                })
            });
        });
    })
}

exports.get_jobs = function (req, res) {
    var params = req.query;

    if (params.count) {
        delete params.count
        models.Job.count(params).exec(function (err, count) {
            res.json(count)
        });
    } else {
        var skip = (parseInt(params.page || 1) - 1) * 10;
        var limit = parseInt(params.limit) || 10;
        delete params.page;
        delete params.limit;
        m.find(models.Job, params, res, res, {skip: skip, limit: limit})

    }
};