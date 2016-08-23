var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , mail = require('../mail'),
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
exports.get_questionnaire = function (req, res) {
    var params = m.getBody(req);
    m.find(models.Questionnaire, params, res, res)
};


exports.job_detailed = function (req, res) {
    m.findOne(models.Job, {_id: req.params._id}, res, res, {populate: 'buyer job seller freelancer'})
}


exports.fn = function (url, auth, modelName, middleware, extra_params, app) {
    var theInstructions = 'return ' + middleware;
    var middlewareFn = new Function(theInstructions);

    if (auth) {
        app.get(url, auth, routing('find'))
        app.post(url + '/count', auth, routing('count'))
    } else {
        app.get(url, routing('find'))
        app.post(url + '/count', routing('count'))
    }


    function routing(type) {

        return function (req, res) {

            var queryParams = m.getBody(req);
            var query = middlewareFn.call(req);
            var info = pubParams(queryParams, query);
            console.log('routing', queryParams, query);

            info.params.populate = extra_params.populate || '';
            info.params.sort = extra_params.sort || info.params.sort || '';
            m[type](models[modelName], queryParams.query, res, res, queryParams.params)
        }
    }
};

exports.job_count_buyer = function (req, res) {
    var params = m.getBody(req)
        , arr = []
        , open = 0
        , ongoing = 0
        , closed = 0;
    arr.push(function (cb) {
        m.count(models.Job, {status: {$in: ['Pending Approval', 'No Applicants']}}, cb, function (jopen) {
            open += jopen;
            cb()
        })
    });
    arr.push(function (cb) {
        m.count(models.JobApply, {status: {$in: ["No Applicants", "Pending Approval", "Service Providers have applied", "Contract started", "Rejected by seller", "Rejected by buyer"]}}, cb, function (jopen) {
            open += jopen;
            cb()
        })
    });
    arr.push(function (cb) {
        m.count(models.Contract, {buyer: params.id, status: {$in: ["Ongoing", "Marked as completed", "Paused"]}}, cb, function (jongoing) {
            ongoing += jongoing;
            cb()
        })
    });
    arr.push(function (cb) {
        m.count(models.Contract, {buyer: params.id, status: {$in: ["Closed"]}}, cb, function (jclosed) {
            closed += jclosed;
            cb()
        })
    });

    async.parallel(arr, function (e, r) {
        m.scb({open: open, ongoing: ongoing, close: closed}, res)
    })
};

exports.job_count_seller = function (req, res) {
    var params = m.getBody(req)
        , arr = []
        , open = 0
        , ongoing = 0
        , closed = 0;
    arr.push(function (cb) {
        m.count(models.Job, {seller: params.id, status: {$in: ["No Applicants"]} }, cb, function (jopen) {
            open += jopen;
            cb()
        })
    });
    arr.push(function (cb) {
        m.count(models.Contract, {seller: params.id, status: {$in: ["Ongoing", "Marked as completed", "Paused"]}}, cb, function (jongoing) {
            ongoing += jongoing;
            cb()
        })
    });
    arr.push(function (cb) {
        m.count(models.Contract, {seller: params.id, status: {$in: ["Closed"]}}, cb, function (jclosed) {
            closed += jclosed;
            cb()
        })
    });

    async.parallel(arr, function (e, r) {
        m.scb({open: open, ongoing: ongoing, close: closed}, res)
    })
};

exports.job = function (req, res) {
    var params = m.getBody(req);
    m.find(models.Job, params, res, res, {sort: '-created_at'})

};

exports.get_info = function (req, res) {
    var params = req.params;
    m.findOne(models[params.model], {_id: params._id}, res, res)
};

exports.filter_job = function (req, res) {
    var params = m.getBody(req);
    if (params.search)
        var re = new RegExp(params.search, 'i');

    if (params.location) {
        params.local_preference = {'$in': [params.location]};
        delete params.location
    }

    if (params.budget_min && params.budget_max) {
        params.budget = {'$gte': params.budget_min, '$lte': params.budget_max};
        delete params.budget_min;
        delete params.budget_max;
    }
    if (params.category) {
        params.type_category = params.category;
        delete params.category
    }

    if (params.search) {
        params['$or'] = [
            {title: new RegExp(params.search, 'i')},
            {description: new RegExp(params.search, 'i')},
            {client_name: new RegExp(params.search, 'i')},
            {company_name: new RegExp(params.search, 'i')}
        ];
        delete params.search
    }
    m.find(models.Job, params, res, res, {populate: 'user', sort: '-created_at'})
};


exports.deleteJob = function (req, res) {
  var params = m.getBody(req);
    m.findUpdate(models.Job, {_id:params.job, user:params.user}, {status:'Deleted'}, res ,res)
};
exports.applyJob = function (req, res) {
    var params = _.extend(m.getBody(req), {
        seller: req.userId,
        freelancer: req.freelancerId
    });
    m.findOne(models.Job, {_id: params.job}, res, function (job) {
        params.buyer = job.user;
        models.User.findOne({_id: params.buyer}).select('email first_name last_name').exec(function (err, buyer) {
            if (err) console.log('apply job find buyer Error: ', err);
            if (buyer)
                mail.job_apply({job: job, user: buyer, title: job.title});
        });
        params.status = 'Service Providers have applied';
        m.findUpdate(models.Job, {_id: job._id}, {status: 'Service Providers have applied'}, res, function () {
            m.findCreateUpdate(models.JobApply, {
                job: job._id,
                freelancer: params.freelancer,
                seller: params.seller
            }, params, res, res)
        })
    })

}

exports.applyJobUpdate = function (req, res) {
    var params = m.getBody(req);
    var query = {
        seller: req.userId,
        freelancer: req.freelancerId,
        job: params.job
    }
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

};

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
};

exports.buyer_open_count = function (req, res) {
    var queryParams = m.getBody(req)
    var info = pubParams(queryParams, {buyer: req.userId})
    m.count(models.JobApply, info.query, res, res, info.params)
};

exports.seller_open = function (req, res) {
    var queryParams = m.getBody(req)
    var info = pubParams(queryParams, {seller: req.userId})
    info.params.populate = 'job freelancer buyer'
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
};
exports.getApplyInfo = function (req, res) {
    var params = m.getBody(req);
    m.findOneEmpty(models.JobApply, {job: req.params.job_id, freelancer: req.freelancerId}, res, res)
};

exports.getInfo = function (req, res) {
    m.find(models.Job, {_id: req.params._id}, res, res, {populate: 'user'})
};

exports.update = function (req, res) {
    var job = m.getBody(req)
    m.findUpdate(models.Job, {user: req.userId, _id: job._id}, job, res, res, {req: req})
};

exports.add_job = function (req, res) {
    var params = m.getBody(req);
    params.user = req.userId;
    params.buyer = req.userId;
    params.status = 'Pending Approval';
    if (params._id > 0) {
        mail.job_created(params);
        m.findUpdate(models.Job, {_id: params._id}, params, res, res)
    } else {
        delete params._id;
        delete params.created_at;
        delete params.suggest;
        delete params.contract;
        mail.job_created(params);
        m.create(models.Job, params, res, res);
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
    var query = {};
    query._id = req.params.id > 0 ? req.params.id : -50;
    models.Job.findOne(query).exec(function (err, _job) {
        if (_job) next(err, _job)
        else new models.Job({}).save(next);
        function next(err, job) {
            if (err) return m.ecb(398, err, res);
            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    var path = config.root + '/public/uploads/job/' + job._id || -52;
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
        }
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

exports.add_favorite = function (req, res) {
    var params = m.getBody(req);
    m.findCreate(models.Favorite, {owner: req.userId, job: params._id}, {}, res, res);
};

exports.remove_favorite = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.Favorite, {owner: req.userId, job: params._id}, res, res);
};

exports.check_job_favorite = function (req, res) {
    var params = m.getBody(req);
    log('sfsfsdfsd', req.userId, params.job);
    m.findOne(models.Favorite, {owner: req.userId, job: params.job}, res, res);

};

exports.get_favorites_jobs = function (req, res) {
    var populate = [
        {
            path: 'job'
        }
    ];
    models.Favorite.find({owner: req.userId, job: {$gt: 0}}).select('job').populate(populate).exec(function (err, favorites) {
        res.json(_.map(favorites, function (fav) {
            return fav.job
        }))
    })
};