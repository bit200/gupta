var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , mail = require('../mail')
    , _ = require('lodash')
    , jwt = require('jsonwebtoken')
    , async = require('async')
    , Admin = models.Admin
    , mkdirp = require('mkdirp');
var randomstring = require("randomstring");

function createToken(admin) {
    return jwt.sign(_.omit(admin, 'password'), config.adminJWTSecret, {expiresInMinutes: 60 * 5});
}
exports.login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send("You must send the username and the password");
    }

    var params = m.getBody(req);
    m.findOne(Admin, {email: params.email}, res, function (admin) {
        if (!admin) {
            return res.status(401).send("The username or password don't match");
        }

        if (!admin.password === req.body.password) {
            return res.status(401).send("The username or password don't match");
        }

        res.status(201).send({
            id_token: createToken(admin),
            id_admin: admin._id,
            email: admin.email
        });
    });
};

exports.add_admin_job = function (req, res) {
    var params = m.getBody(req);
    params.job.user = params.adminID;
    params.job.buyer = params.adminID;
    params.job.status = 'open';
    if (params.job._id) {
        m.findUpdate(models.Job, {_id: params.job._id}, params.job, res, res)
    } else {
        delete params.job._id;
        delete params.job.created_at;
        delete params.job.suggest;
        delete params.job.contract;
        m.create(models.Job, params.job, res, res)
    }
};

exports.get_sellers = function (req, res) {
    var q = {};
    if (req.query.registrationStatus) q.registrationStatus = parseInt(req.query.registrationStatus);
    models.Freelancer.find(q).populate('business_account').lean().exec(function (err, freelancers) {
        res.json(freelancers)
    })
};
exports.get_count_jobs = function (req, res) {
    models.Job.count({}).exec(function (err, count) {
        res.jsonp(count)
    });
};

exports.get_jobs = function (req, res) {
    var params = m.getBody(req);
    m.find(models.Job, {admin_approved: 0}, res, res, {limit: params.limit, skip: params.skip})
};

exports.get_seller = function (req, res) {
    models.Freelancer.findOne({_id: req.params.id}).populate('poster Attachments work contact_detail service_packages user').exec(function (err, freelancer) {
        res.json(freelancer)
    })
};

exports.edit_filter = function (req, res) {
    if (req.body.query.main) {
        models.ServiceProvider.update({name: req.body.query.type}, {name: req.body.newParams.type}).exec();
        delete req.body.query.main;
    }
    models.Filters.update(req.body.query, req.body.newParams, {multi: true}).exec(function (err, result) {
        if (err) {
            console.log('Error update filters', err);
            return res.send(398);
        }
        res.send(200);
    })
};


exports.delete_filter = function (req, res) {
    var params = JSON.parse(req.params.data);
    if (params.main) {
        m._findRemove(models.ServiceProvider, {name: params.type}, '', '');
        delete params.main;
    }
    m._findRemove(models.Filters, params, res, function () {
        res.send(200);
    });
};


exports.all = function (req, res) {
    var params = m.getBody(req);
    m.find(models[params.model], {}, res, function (item) {
        m.count(models[params.model], {}, res, function (count) {
            m.scb({data: item, count: count}, res)
        });
    }, {skip: params.skip, limit: params.limit})
};

exports.all_projects = function (req, res) {
    var params = m.getBody(req);
    m.find(models.Job, {}, res, function (jobs) {
        m.count(models.Job, {}, res, function (count) {
            m.scb({data: jobs, count: count}, res)
        });
    }, {skip: params.skip, limit: params.limit})
};

exports.all_users = function (req, res) {
    var params = m.getBody(req);
    m.find(models.User, {}, res, function (users) {
        m.count(models.User, {}, res, function (count) {
            m.scb({data: users, count: count}, res)
        });
    }, {skip: params.skip, limit: params.limit})
};

exports.all_freelancer = function (req, res) {
    var params = m.getBody(req);
    m.find(models.Freelancer, {}, res, function (freelancers) {
        m.count(models.Freelancer, {}, res, function (count) {
            m.scb({data: freelancers, count: count}, res)
        });
    }, {skip: params.skip, limit: params.limit})
};

exports.change = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models[params.model], {_id: params.item._id}, params.item, res, res)
};

exports.change_user = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.User, {_id: params.user._id}, params.user, res, res)
};

exports.change_freelancer = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Freelancer, {_id: params.user._id}, params.user, res, res)
};

exports.delete = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models[params.model], {_id: params._id}, res, res)
};

exports.delete_users = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.User, {_id: params._id}, res, res)
};
exports.delete_freelancers = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.Freelancer, {_id: params._id}, res, res)
};
exports.sorted_freelancer  = function (req, res) {
    var params = m.getBody(req);
    params.sorted = !params.sorted;
    m.findUpdate(models.Freelancer, {_id: params._id}, {sorted: params.sorted}, res, res)
};

exports.delete_projects = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.Job, {_id: params._id}, res, res)
};

exports.create_filter = function (req, res) {
    if (req.body.main)
        m.create(models.ServiceProvider, {name: req.body.type, isActive: true, sub_categories: []}, '', '');
    m.create(models.Filters, req.body, res, res);
};

exports.change_order = function (req, res) {

    var params = req.body;

    var query = {}, setParam = {};

    if (params.type) {
        query = {
            type: params.type,
            filter: params.name_from
        };
        setParam = {
            $set: {filter_order: params.order_from}
        }
    }
    else {
        query.type = params.name_from;
        setParam.$set = {order: params.order_from};
    }
    models.Filters.update(query, setParam, {multi: true}).exec(function (err, data) {
        if (err) return m.ecb(398, err, res);
        if (params.type) {
            query.filter = params.name_to;
            setParam.$set = {filter_order: params.order_to};
        }
        else {
            query.type = params.name_to;
            setParam.$set = {order: params.order_to};
        }
        models.Filters.update(query, setParam, {multi: true}).exec(function (err, data) {
            if (err) return m.ecb(398, err, res);
            m.scb(data, res);
        })
    });
};

exports.get_header = function (req, res) {
    var params = m.getBody(req);
    m.find(models.HeaderText, {}, res, res, {sort:'_id',skip:params.skip, limit: params.limit})
};

exports.get_default_header = function (req, res) {
    var params = m.getBody(req);
    var arrFunc = [];
    _.each(params.array, function(item){
        arrFunc.push(function(cb){
            m.findCreate(models.HeaderText, {type:item}, {}, cb, cb)
        })
    });
   async.parallel(arrFunc, function(e,r){
       m.scb('ok', res)
   })

};

exports.update_header = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.HeaderText, {type: params.type}, params, res, res)
};

exports.edit_location = function (req, res) {
    m.findUpdate(models.Location, req.body.query, req.body.params, res, res);
};

exports.delete_location = function (req, res) {
    var params = JSON.parse(req.params.data);
    m._findRemove(models.Location, params, res, function () {
        res.send(200);
    });
};
exports.add_location = function (req, res) {
    m.findCreate(models.Location, req.body.params, req.body.params, res, res);
};


exports.approve_registration = function (req, res) {
    var password = randomstring.generate(7);
    models.Freelancer.findOne({_id: req.params.id}).populate('contact_detail').exec(function (err, freelancer) {
        if (freelancer.user) {
            freelancer.registrationStatus = 1;
            freelancer.save(function () {
            });
            mail.approveAgencyRegistration({
                freelancer: freelancer
            }, freelancer.contact_detail.email);
            return res.send(200)
        }

        m.create(models.User, {email: freelancer.contact_detail.email, password: password, first_singin: 1}, res, function (user) {
            freelancer.user = user;
            freelancer.registrationStatus = 1;
            freelancer.save(function () {
                mail.approveAgencyRegistration({
                    freelancer: freelancer,
                    email: user.email,
                    password: password
                }, user.email);
                res.send(200)
            })
        });
    });
};

exports.reject_registration = function (req, res) {
    m.findUpdate(models.Freelancer, {_id: req.params.id}, {registrationStatus: 2, reject_reason: req.body.reject_reason}, res, function (freelancer) {
        mail.rejectAgencyRegistration({
            freelancer: freelancer
        }, freelancer.name);
        res.send(200)
    }, {populate: 'contact_detail'});
};


exports.approve_job = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Job, {_id: params._id}, {admin_approved: 1}, res, function (job) {
        mail.job_approve(job, res, m.scb(job, res))
    }, {populate: 'user'});
};

exports.update_job = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Job, {_id: params.job._id}, params.job, res, res)
};

exports.reject_job = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Job, {_id: params._id}, {admin_approved: 2, reject_reason: req.body.reject_reason}, res, function (job) {
        mail.job_reject(job.user, req.body.reject_reason, res, m.scb(job, res))
    }, {populate: 'user'});
};

exports.update_questionnaire = function (req, res) {
    var params = m.getBody(req);
    m.findCreateUpdate(models.Questionnaire, {_id: params._id}, params, res, res)
};

exports.get_questionnaires = function (req, res) {
    var params = m.getBody(req);
    m.find(models.Questionnaire, {service_provider: params.service_provider, type: params.type}, res, function (question) {
        m.count(models.Questionnaire, {service_provider: params.service_provider, type: params.type}, function (err) {
            m.scb({data: question, count: 0}, res)
        }, function (count) {
            m.scb({data: question, count: count}, res)
        });
    }, {skip: params.skip, limit: params.limit})
};

exports.delete_questionnaire = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.Questionnaire, {_id: params._id}, res, res)
};

exports.business_accounts = function (req, res) {
    models.BusinessUser.find(req.query).populate('agency').exec(function (err, business_accounts) {
        res.jsonp(business_accounts)
    });
};

exports.approve_account = function (req, res) {
    models.BusinessUser.findOne({_id: req.params.id}).exec(function (err, b_account) {
        b_account.status = 1;
        if (!b_account.user) {
            var password = randomstring.generate(7);
            new models.User({email: b_account.email, password: password}).save(function (err, user) {
                if (!user) res.send(200);
                b_account.user = user;
                b_account.save(function () {
                    //console.log(b_account)
                    mail.claimApproved(b_account);
                    m.findUpdate(models.Freelancer, {_id: b_account.agency}, {business_account: b_account._id}, res, function (freelancer) {
                        mail.approveAgencyRegistration({
                            freelancer: freelancer,
                            email: user.email,
                            password: password
                        }, user.email);
                        res.send(freelancer)
                    })
                })
            })
        } else {
            b_account.save(function () {
                mail.claimApproved(b_account);
                m.findUpdate(models.Freelancer, {_id: b_account.agency}, {business_account: b_account._id}, res, res)
            })
        }
    });

};

exports.reject_account = function (req, res) {
    m.findUpdate(models.BusinessUser, {_id: req.params.id}, {status: 2, reject_reason: req.body.reject_reason}, res, function (b_account) {
        mail.claimRejected(b_account);
        b_account.remove(function (err, data) {
            res.jsonp(b_account)
        });

    });
};