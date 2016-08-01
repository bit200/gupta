var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , mail = require('../mail')
    , _ = require('lodash')
    , jwt = require('jsonwebtoken')
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
            id_token: createToken(admin)
        });
    });
};

exports.get_sellers = function (req, res) {
    var q = {};
    if (req.query.registrationStatus) q.registrationStatus = parseInt(req.query.registrationStatus);
    models.Freelancer.find(q).populate('business_account').lean().exec(function (err, freelancers) {
        res.json(freelancers)
    })
};
exports.get_jobs = function (req, res) {
    models.Job.find({admin_approved: 0}).exec(function (err, jobs) {
        res.json(jobs)
    })
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

exports.all_projects = function (req, res) {
    var params = m.getBody(req);
    m.find(models.Job, {}, res, function(jobs){
        m.count(models.Job,{}, res, function(count){
            m.scb({data:jobs, count: count},res)
        });
    }, {skip:params.skip, limit:params.limit})
};
exports.all_users = function (req, res) {
    var params = m.getBody(req);
    m.find(models.User, {}, res, function(users){
        m.count(models.User,{}, res, function(count){
            m.scb({data:users, count: count},res)
        });
    }, {skip:params.skip, limit:params.limit})
};

exports.all_freelancer = function (req, res) {
    var params = m.getBody(req);
    m.find(models.Freelancer, {}, res, function(freelancers){
        m.count(models.Freelancer,{}, res, function (count) {
            m.scb({data:freelancers, count: count},res)
        });
    }, {skip:params.skip, limit:params.limit})
};


exports.change_user = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.User, {_id:params.user._id}, params.user, res, res)
};

exports.change_freelancer = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Freelancer, {_id:params.user._id}, params.user, res, res)
};

exports.delete_users = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.User, {_id: params._id}, res, res)
};
exports.delete_freelancers = function (req, res) {
    var params = m.getBody(req);
    m.findRemove(models.Freelancer, {_id: params._id}, res, res)
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
        mail.job_approve(job.user, res, m.scb(job, res))
    }, {populate: 'user'});
};

exports.reject_job = function (req, res) {
    var params = m.getBody(req);
    m.findUpdate(models.Job, {_id: params._id}, {admin_approved: 2, reject_reason: req.body.reject_reason}, res, function (job) {
        mail.job_approve(job.user, res, m.scb(job, res))
    }, {populate: 'user'});
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
                    console.log(b_account)
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
    m.findUpdate(models.BusinessUser, {_id: req.params.id}, {status: 2, reject_reason: req.body.reject_reason}, res, function (account) {
        res.jsonp(account)
    });
};