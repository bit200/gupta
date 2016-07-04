var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , mail = require('../mail')
    , md5 = require('md5')
    , async = require('async')
    , randomstring = require('randomstring')
    , _ = require('underscore')
    , mkdirp = require('mkdirp');


exports.get_sellers = function (req, res) {
    var q = {};
    if (req.query.registrationStatus) q.status = parseInt(req.query.registrationStatus);
    models.Freelancer.find().select('type name location').lean().exec(function(err, freelancers){
        res.json(freelancers)
    })
};
exports.get_seller = function (req, res) {
    models.Freelancer.findOne({_id: req.params.id}).populate('poster Attachments work contact_detail service_packages user').exec(function(err, freelancer){
        res.json(freelancer)
    })
};

exports.approve_registration = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Freelancer, {_id: params.id}, {registrationStatus: 1}, res, function(freelancer){
        m.create(models.User, {})
        mail.approveAgency({
            freelancer: freelancer,
        }, freelancer.name);

    })
};

exports.reject_registration = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Freelancer, {_id: params.id}, {registrationStatus: 2}, res, res)
};

exports.approve_agency = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.BusinessUser, {email: params.email}, {isActive: true}, res, res)
};
exports.get_users = function (req, res) {
    m.find(models.User, {}, res, res)
};

exports.get_business_users = function (req, res) {
    m.find(models.BusinessUser, {}, res, res, {populate: 'agency'})
};

exports.get_job = function (req, res) {
    m.find(models.Job, {}, res, res)
};


exports.reject_agency = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.BusinessUser, {email: params.email}, {isActive: false}, res, res)
};

exports.approve_job = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Job, {_id: params._id}, {admin_approved: 1}, res, function (job) {
        m.findOne(models.User, {_id: job.user}, res, function (user) {
            mail.job_approve(user, res, m.scb(job, res))
        })
    })
};

exports.reject_job = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Job, {_id: params._id}, {admin_approved: 2, reject_reason: params.reject_reason}, res, function (job) {
        m.findOne(models.User, {_id: job.user}, res, function (user) {
            mail.job_reject(user, res, params.reject_reason, m.scb(job, res))
        })
    })
};

exports.add_seller = function (req, res) {
    var params = m.getBody(req)
        , arrFunc = [];
    arrFunc.push(function (cb) {
        if (params.work) {
            m.create(models.Work, params.work, res, function (work) {
                params.work = work._id;
                cb()
            })
        } else {
            cb()
        }
    });
    arrFunc.push(function (cb) {
        if (params.contact) {
            m.create(models.ContactDetail, params.contact, res, function (contact) {
                params.contact = contact._id;
                cb()
            })
        } else {
            cb()
        }
    });

    // m.findUpdate(models.User, {_id: params.userId}, {freelancer: freelancer._id}, res, m.scb(freelancer, res))
    async.parallel(function (e, r) {
        m.create(models.Freelancer, params, res, res)
    })
};

exports.suggest_edit_job = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Job, {_id: params._id}, {admin_approved: 3, reject_reason: params.reject_reason}, res, function (job) {
        log(job)
        m.findOne(models.User, {_id: job.user}, res, function (user) {
            mail.job_edit(user, params.reject_reason, params._id, res, m.scb(job, res))
        })
    })
};

exports.approved = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.User, {email: params.email}, {admin_approved: 1}, res, function (user) {
        var newseller = {
            login: randomstring.generate(10),
            password: md5(randomstring.generate(15))
        };
        m.create(User, params, res, function (user) {
            mkdirp(config.root + "/public/uploads/" + user._id.toString(), function (err) {
                if (err) console.log(err);
                else {
                }
            });
            mail.registrationSeller(user, user.email);
            m.scb({}, res);
//        mkdirp('../../public/img/user'+user._id);
        })
    })
};

exports.reject = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.User, {email: params.email}, {admin_approved: 2, reject_reason: params.reject_reason}, res, res)
};