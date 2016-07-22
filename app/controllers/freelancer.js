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
    if (req.body._id){
        req.body._id = parseInt(req.body._id)
        m.findUpdate(models.ContactDetail, {_id: parseInt(req.body._id)}, req.body,res,res)
    }else 
        m.create(models.ContactDetail, req.body,res,res)
};

exports.freelancer_request = function (req, res) {
    var params = m.getBody(req);
    if (req.userId){
        m.findCreateUpdate(models.Freelancer, {user: req.userId}, params, res, function(freelancer){
            mail.newRegistration_admin(freelancer);
            res.send(freelancer)
        })
    }
    else{
        m.create(models.Freelancer,params,res,function(freelancer){
            mail.newRegistration_admin(freelancer);
            res.send(freelancer)
        })
        
    }
};

exports.my_business_accounts = function (req, res) {
    if (!req.userId) return res.jsonp([]);
    models.BusinessUser.find({user: req.userId}).exec(function(err, business_accounts){
        res.jsonp(business_accounts)
    });
};

exports.get_count_rating = function (req, res) {
    var params = m.getBody(req);
    models.SetRating.count({freelancer:params.freelancer}).exec(function(err, count){
        if(err){
            m.ecb(404,err,res)
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
    if (params["service_packages.0"]){
        params["service_packages.0"] = {
            $exists: params["service_packages.0"] == 'true'
        }
    }
    if (params.count){
        delete params.count
        models.Freelancer.count(params).exec(function(err, count){
            res.json(count)
        });
    }else{
        var skip = (parseInt(params.page || 1)-1)*10;
        var limit = parseInt(params.limit) || 10;
        delete params.page;
        delete params.limit;
        console.log(params)
        m.find(models.Freelancer, params, res, res, {populate: 'contact_detail', skip: skip, limit: limit})
    }
};
exports.get_favorites = function(req, res){
  models.Favorite.find({owner: req.userId}).select('freelancer').exec(function(err, favorites){
      res.json(_.map(favorites, function(fav){
          return fav.freelancer
      }))
  })
};

exports.get_freelancer = function (req, res) {
    var populate = [
        {
            path:'poster'
        },
        {
            path:'contact_detail'
        },
        {
            path:'business_account'
        },
        {
            path:'business_account'
        },
        {
            path:'work',
            populate: {
                path: 'work_samples',
                populate: {
                    path: 'attachments',
                    model: 'Attachment'
                }
            }
        },
        {
            path:'service_packages',
            populate: {
                path: 'preview'
            }
        }
    ];
    models.Freelancer.findOne({_id: req.params.id}).populate(populate).exec(function(err, freelancer){
        res.json(freelancer)
    });
};

exports.get_jobs_count = function (req, res) {
    req.query._id = req.params.id;
    models.Job.count(req.query).exec(function(err, count){
      res.jsonp(count)
    });
};

exports.get_current_freelancer = function (req, res) {
    var populate = [
        {
            path:'poster'
        },
        {
            path:'contact_detail'
        },
        {
            path:'business_account'
        },
        {
            path:'business_account'
        },
        {
            path:'work',
            populate: {
                path: 'work_samples',
                populate: {
                    path: 'attachments'
                }
            }
        },
        {
            path:'service_packages',
            populate: {
                path: 'preview'
            }
        }
    ];
    models.Freelancer.findOne({user: req.userId}).populate(populate).exec(function(err, freelancer){
        res.json(freelancer)
    });
};

exports.search_freelancers = function (req, res) {
    var query = {};
    if (req.query.name)
        query.name = new RegExp(req.query.name, "i")
    if (req.query.city)
        query.location = req.query.city;
    models.Freelancer.find(query).select('name').limit(10).exec(function(err, freelancers){
        res.json(freelancers)
    });
};

exports.freelancer_views_count = function (req, res) {
    var q = {freelancer: req.params.id}
    if (req.query.days) {
        var d = new Date();
        d.setDate(d.getDate()-parseInt(req.query.days));
        q.created_at = {$gte: d};
    }
    models.Freelancer.update({_id: req.params.id},{$inc: {views: 1}}).exec(function(){})
    models.ViewsProfile.count(q).exec(function(err, count){
        res.json(count);
    });
};

exports.add_freelancer_view = function (req, res) {
    new models.ViewsProfile({freelancer: req.params.id}).save(function(){
        res.send(200);
    });
};

exports.add_favorite = function (req, res) {
    new models.Favorite({owner: req.userId, freelancer: req.params.id}).save(function(){
        res.send(200);
    });
};

exports.remove_favorite = function (req, res) {
    models.Favorite.remove({owner: req.userId, freelancer: req.params.id}).exec(function(){
        res.send(200);
    });
};

exports.check_favorite = function (req, res) {
    models.Favorite.count({owner: req.userId, freelancer: req.params.id}).exec(function(err, count){
        res.send(!!count);
    });
};

exports.claim_request = function(req,res){
    var params = m.getBody(req);
    if (req.userId)
        params.user = req.userId;
    new models.BusinessUser(params).save(function(err, business_user){
        mail.newClaim(business_user);
        res.json(business_user);
    })
};


exports.get_clients = function(req,res){
    var params = m.getBody(req);
    var re = new RegExp(params.name, 'i');
    m.find(models.PastClient, {name:re}, res, res, {populate:'attachment'})
};

exports.past_client = function(req,res){
    var pastClient;
    var getPastClient = function(req, cb){
        if (pastClient) return cb();
        if (req.body.id)
            models.PastClient.findOne({_id: parseInt(req.body.id)}).exec(function(err, pastClientT){
                pastClient = pastClientT;
                cb()
            });
        else new models.PastClient().save(function(err, pastClientT){
            pastClient = pastClientT;
            cb()
        });
    };
    var attachment;
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            getPastClient(req,function() {
                var path = config.root + '/public/uploads/past_clients/' + pastClient._id;
                mkdirp.sync(path);
                cb(null, path)
            })
        },
        filename: function (req, file, cb) {
            var name = new Date().getTime()+'_'+file.originalname;
            cb(null, name)
        }
    });

    var upload = multer({
        storage: storage
    }).any();
    upload(req, res, function (err) {
        getPastClient(req, function(){
            async.forEach(req.files, function(file, cb){
                new models.Attachment({
                    originalName: file.originalname,
                    name: file.filename,
                    path: 'past_clients/'+ pastClient._id
                }).save(function(err, attach){
                    attachment = attach;
                    cb();
                })
            }, function(){
                delete req.body.id;
                pastClient = _.extend(pastClient,req.body);
                pastClient.attachment = attachment;
                pastClient.save(function(err,pastClient){
                    pastClient.populate('attachment',function(err, pastClient){
                        res.jsonp(pastClient)
                    })
                });
            });
        });

    });
};

exports.delete_past_client = function(req,res){
    models.PastClient.findOne({_id: req.params.id}).exec(function(err, past_client){
        past_client.remove(function(){
            res.send(200)
        });
    });
};