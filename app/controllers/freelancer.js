var models = require('../db')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    mail = require('../mail'),
    _ = require('underscore'),
    mkdirp = require('mkdirp'),
    multer = require('multer'),
    async = require('async');

exports.add_update_contact_detail = function (req, res) {
    if (req.body._id) {
        req.body._id = parseInt(req.body._id)
        m.findUpdate(models.ContactDetail, {_id: parseInt(req.body._id)}, req.body, res, res)
    } else
        m.create(models.ContactDetail, req.body, res, res)
};

exports.freelancer_request = function (req, res) {
    var params = m.getBody(req);
    if (req.userId) {
        m.findCreateUpdate(models.Freelancer, {user: req.userId}, params, res, function (freelancer) {
            mail.newRegistration_admin(freelancer);
            res.send(freelancer)
        })
    }
    else {
        m.create(models.Freelancer, params, res, function (freelancer) {
            mail.newRegistration_admin(freelancer);
            res.send(freelancer)
        })

    }
};

exports.my_business_accounts = function (req, res) {
    if (!req.userId) return res.jsonp([]);
    models.BusinessUser.find({user: req.userId}).exec(function (err, business_accounts) {
        res.jsonp(business_accounts)
    });
};

exports.get_count_rating = function (req, res) {
    var params = m.getBody(req);
    models.SetRating.count({freelancer: params.freelancer}).exec(function (err, count) {
        if (err) {
            m.ecb(404, err, res)
        } else {
            m.scb(count, res)
        }
    })
};

exports.get_freelancers = function (req, res) {
    var params = req.query;
    params.registrationStatus = 1;

    if (params.experience)
        params.experience = {$gte: parseInt(params.experience)};
    if (params["service_packages.0"]) {
        params["service_packages.0"] = {
            $exists: params["service_packages.0"] == 'true'
        }
    }
    if (params.count) {
        delete params.count
        models.Freelancer.count(params).exec(function (err, count) {
            res.json(count)
        });
    } else {
        var skip = (parseInt(params.page || 1) - 1) * 10;
        var limit = parseInt(params.limit) || 10;
        delete params.page;
        delete params.limit;
        console.log(params)
        m.find(models.Freelancer, params, res, res, {populate: 'contact_detail', skip: skip, limit: limit, sort:'-views'})
    }
};
exports.get_favorites = function (req, res) {
    models.Favorite.find({owner: req.userId}).select('freelancer').exec(function (err, favorites) {
        res.json(_.map(favorites, function (fav) {
            return fav.freelancer
        }))
    })
};

exports.get_freelancer = function (req, res) {
    var populate = [
        {
            path: 'poster'
        },
        {
            path: 'contact_detail'
        },
        {
            path: 'business_account'
        },
        {
            path: 'business_account'
        },
        {
            path: 'work',
            populate: {
                path: 'work_samples',
                populate: {
                    path: 'attachments',
                    model: 'Attachment'
                }
            }
        },
        {
            path: 'service_packages',
            populate: {
                path: 'preview'
            }
        }
    ];
    models.Freelancer.findOne({_id: req.params.id}).populate(populate).exec(function (err, freelancer) {
        res.json(freelancer)
    });
};

exports.get_jobs_count = function (req, res) {
    req.query._id = req.params.id;
    models.Job.count(req.query).exec(function (err, count) {
        res.jsonp(count)
    });
};

exports.get_current_freelancer = function (req, res) {
    var populate = [
        {
            path: 'poster'
        },
        {
            path: 'contact_detail'
        },
        {
            path: 'business_account'
        },
        {
            path: 'business_account'
        },
        {
            path: 'work',
            populate: {
                path: 'work_samples',
                populate: {
                    path: 'attachments'
                }
            }
        },
        {
            path: 'service_packages',
            populate: {
                path: 'preview'
            }
        }
    ];
    models.Freelancer.findOne({user: req.userId}).populate(populate).exec(function (err, freelancer) {
        res.json(freelancer)
    });
};

exports.search_freelancers = function (req, res) {
    var query = {};
    if (req.query.name)
        query.name = new RegExp(req.query.name, "i")
    if (req.query.city)
        query.location = req.query.city;
    models.Freelancer.find(query).select('name').limit(10).exec(function (err, freelancers) {
        res.json(freelancers)
    });
};

exports.freelancer_views_count = function (req, res) {
    var q = {freelancer: req.params.id}
    if (req.query.days) {
        var d = new Date();
        d.setDate(d.getDate() - parseInt(req.query.days));
        q.created_at = {$gte: d};
    }
    models.Freelancer.update({_id: req.params.id}, {$inc: {views: 1}}).exec(function () {
    })
    models.ViewsProfile.count(q).exec(function (err, count) {
        res.json(count);
    });
};

exports.add_freelancer_view = function (req, res) {
    new models.ViewsProfile({freelancer: req.params.id}).save(function () {
        res.send(200);
    });
};

exports.add_favorite = function (req, res) {
    new models.Favorite({owner: req.userId, freelancer: req.params.id}).save(function () {
        res.send(200);
    });
};

exports.remove_favorite = function (req, res) {
    models.Favorite.remove({owner: req.userId, freelancer: req.params.id}).exec(function () {
        res.send(200);
    });
};

exports.check_favorite = function (req, res) {
    models.Favorite.count({owner: req.userId, freelancer: req.params.id}).exec(function (err, count) {
        res.send(!!count);
    });
};

exports.claim_request = function (req, res) {
    var params = m.getBody(req);
    if (req.userId)
        params.user = req.userId;
    new models.BusinessUser(params).save(function (err, business_user) {
        mail.newClaim(business_user);
        res.json(business_user);
    })
};


exports.get_clients = function (req, res) {
    var params = m.getBody(req);
    var re = new RegExp(params.name, 'i');
    m.find(models.PastClient, {name: re}, res, res, {populate: 'attachment'})
};

exports.past_client = function (req, res) {
    var pastClient;
    var getPastClient = function (req, cb) {
        if (pastClient) return cb();
        if (req.body.id)
            models.PastClient.findOne({_id: parseInt(req.body.id)}).exec(function (err, pastClientT) {
                pastClient = pastClientT;
                cb()
            });
        else new models.PastClient().save(function (err, pastClientT) {
            pastClient = pastClientT;
            cb()
        });
    };
    var attachment;
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            getPastClient(req, function () {
                var path = config.root + '/public/uploads/past_clients/' + pastClient._id;
                mkdirp.sync(path);
                cb(null, path)
            })
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
        getPastClient(req, function () {
            async.forEach(req.files, function (file, cb) {
                new models.Attachment({
                    originalName: file.originalname,
                    name: file.filename,
                    path: 'past_clients/' + pastClient._id
                }).save(function (err, attach) {
                    attachment = attach;
                    cb();
                })
            }, function () {
                delete req.body.id;
                pastClient = _.extend(pastClient, req.body);
                pastClient.attachment = attachment;
                pastClient.save(function (err, pastClient) {
                    pastClient.populate('attachment', function (err, pastClient) {
                        res.jsonp(pastClient)
                    })
                });
            });
        });

    });
};

exports.delete_past_client = function (req, res) {
    models.PastClient.findOne({_id: req.params.id}).exec(function (err, past_client) {
        past_client.remove(function () {
            res.send(200)
        });
    });
};

exports.make_fake = function(req,res){
    var arrFunc = [];
    arrFunc.push(function (cb) {
        var freelancer = {
            "user": 100, "work": 100, "type": "agency",
            "name": "Siavash A",
            "introduction": "Senior IOS Developer",
            "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
            "popularity": 99999, "rating": 4,
            "isActive": 1, "registrationStatus": 1, "service_packages": [],
            "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
            "service_providers": ["Creative and Ad Making"],
            "cities": ["Mumbai"],
            "views": 21005
        };
        m.findCreate(models.Freelancer, freelancer, {}, cb,cb);
    });

    arrFunc.push(function (cb) {

        var freelancer = {
            "user": 101, "work": 101, "type": "agency",
            "name": "Soumya Nalam",
            "introduction": "Senior IOS Developer",
            "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
            "popularity": 95999, "rating": 4,
            "isActive": 1, "registrationStatus": 1, "service_packages": [],
            "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
            "service_providers": ["Content Writing"],
            "cities": ["Mumbai"],
            "views": 18005
        };
        m.findCreate(models.Freelancer, freelancer, {}, cb,cb);
    });

    arrFunc.push(function (cb) {
        var freelancer = {
            "user": 102, "work": 102, "type": "agency",
            "name": "Shadrack K",
            "introduction": "Senior IOS Developer",
            "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
            "popularity": 94999, "rating": 2,
            "isActive": 1, "registrationStatus": 1, "service_packages": [],
            "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
            "service_providers": ["Bloggers and Influencers"],
            "cities": ["Mumbai"],
            "views": 15005
        };
        m.findCreate(models.Freelancer, freelancer, {}, cb,cb);
    });

    arrFunc.push(function (cb) {
        var freelancer = {
            "user": 103, "work": 103, "type": "agency",
            "name": "Mohamed M. A.",
            "introduction": "Senior IOS Developer",
            "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
            "popularity": 93999, "rating": 4,
            "isActive": 1, "registrationStatus": 1, "service_packages": [],
            "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
            "service_providers": ["Bloggers and Influencers"],
            "cities": ["Mumbai"],
            "views": 12005
        };
        m.findCreate(models.Freelancer, freelancer, {}, cb,cb);
    });

    arrFunc.push(function (cb) {
        var freelancer = {
            "user": 104, "work": 104, "type": "agency",
            "name": "David Kibra",
            "introduction": "Senior IOS Developer",
            "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
            "popularity": 92999, "rating": 4,
            "isActive": 1, "registrationStatus": 1, "service_packages": [],
            "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
            "service_providers": ["Event Management"],
            "cities": ["Mumbai"],
            "views": 11005
        };
        m.findCreate(models.Freelancer, freelancer, {}, cb,cb);
    });

    arrFunc.push(function (cb) {
        var freelancer = {
            "user": 105, "work": 105, "type": "agency",
            "name": "Emma Davidson",
            "introduction": "Senior IOS Developer",
            "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
            "popularity": 90999, "rating": 4,
            "isActive": 1, "registrationStatus": 1, "service_packages": [],
            "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
            "service_providers": ["Content Writing"],
            "cities": ["Mumbai"],
            "views": 10005
        };
        m.findCreate(models.Freelancer, freelancer, {}, cb,cb);
    });

    arrFunc.push(function (cb) {
        var freelancer = {
            "user": 106, "work": 106, "type": "agency",
            "name": "Retha Groenewald",
            "introduction": "Senior IOS Developer",
            "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
            "popularity": 89999, "rating": 4,
            "isActive": 1, "registrationStatus": 1, "service_packages": [],
            "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
            "service_providers": ["Direct Marketing"],
            "cities": ["Mumbai"],
            "views": 9000
        };
        m.findCreate(models.Freelancer, freelancer, {}, cb,cb);
    });

    arrFunc.push(function (cb) {
        var freelancer = {
            "user": 106, "work": 106, "type": "agency",
            "name": "Leeanna Weideman",
            "introduction": "Senior IOS Developer",
            "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
            "popularity": 89999, "rating": 4,
            "isActive": 1, "registrationStatus": 1, "service_packages": [],
            "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
            "service_providers": ["Media Planning"],
            "cities": ["Mumbai"],
            "views": 9000
        };
        m.findCreate(models.Freelancer, freelancer, {}, cb,cb);
    });

    arrFunc.push(function (cb) {
        var job = {
            "job_visibility": true,
            "title": "Technical Writing & Creative Writing",
            "description": "Proven UI experience. We are looking for a talented Web / UI Designer to create amazing user experiences. A Reputed UK based Software Company is looking for a...",
            "budget": 10000,
            "mobile": "+5944-345-345-4",
            "client_name": "Sqall Leonhart",
            "company_name": "BEST NaME EVER",
            "website": "elefant",
            "type_category": "Content Writing",
            "type_filter": "Languages",
            "type_name": "German",
            "email": "jiga-san@mail.ru",
            "user": 100002,
            "buyer": 100002,
            "status": "open",
            "contracts": [],
            "admin_approved": 1,

            "local_preference": [
                "Hyderabat"
            ]
        };
        m.findCreate(models.Job, job,{}, cb,cb);
    });

    arrFunc.push(function (cb) {
        var job = {
            "job_visibility": true,
            "title": "Editor, Writer, Technical writer",
            "description": "Proven UI experience. We are looking for a talented Web / UI Designer to create amazing user experiences. A Reputed UK based Software Company is looking for a...",
            "budget": 10000,
            "mobile": "+5944-345-345-4",
            "client_name": "Sqall Leonhart",
            "company_name": "BEST NaME EVER",
            "website": "elefant",
            "type_category": "Content Writing",
            "type_filter": "Languages",
            "type_name": "German",
            "email": "jiga-san@mail.ru",
            "user": 100002,
            "buyer": 100002,
            "status": "open",
            "contracts": [],
            "admin_approved": 1,
            "local_preference": [
                "Hyderabat"
            ]
        };
        m.findCreate(models.Job, job,{}, cb,cb);
    });

    arrFunc.push(function (cb) {
        var job = {
            "job_visibility": true,
            "title": "Copywriter. Technical writer. Editor",
            "description": "Proven UI experience. We are looking for a talented Web / UI Designer to create amazing user experiences. A Reputed UK based Software Company is looking for a...",
            "budget": 10000,
            "mobile": "+5944-345-345-4",
            "client_name": "Sqall Leonhart",
            "company_name": "BEST NaME EVER",
            "website": "elefant",
            "type_category": "Content Writing",
            "type_filter": "Languages",
            "type_name": "German",
            "email": "jiga-san@mail.ru",
            "user": 100002,
            "buyer": 100002,
            "status": "open",
            "contracts": [],
            "admin_approved": 1,
            "local_preference": [
                "Hyderabat"
            ]
        };
        m.findCreate(models.Job, job,{}, cb,cb);
    });

    arrFunc.push(function (cb) {
        var job = {
            "job_visibility": true,
            "title": "Business writing consultant",
            "description": "Proven UI experience. We are looking for a talented Web / UI Designer to create amazing user experiences. A Reputed UK based Software Company is looking for a...",
            "budget": 10000,
            "mobile": "+5944-345-345-4",
            "client_name": "Sqall Leonhart",
            "company_name": "BEST NaME EVER",
            "website": "elefant",
            "type_category": "Content Writing",
            "type_filter": "Languages",
            "type_name": "German",
            "email": "jiga-san@mail.ru",
            "user": 100002,
            "buyer": 100002,
            "status": "open",
            "contracts": [],
            "admin_approved": 1,
            "local_preference": [
                "Hyderabat"
            ]
        };
        m.findCreate(models.Job, job,{}, cb,cb);
    });
  async.parallel(arrFunc, function(e,r){
      m.scb('created!', res)
  })
};