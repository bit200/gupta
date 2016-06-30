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
    if (req.body.id){
        req.body.id = parseInt(req.body.id)
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

exports.deleteFile = function (req, res) {
    async.series([
        function (cb) {
            m.find(models.UploadFile, {_id: req.body._id}, res, function (responce) {
                fs.unlink("." + responce[0].url, function (err) {
                    console.log(err);
                    cb(null)
                });
            });
        },
        function(cb){
            if (!req.userId) return cb()
            models.Freelancer.findOne({user: req.userId}).exec(function(err, user){
                if (user.Attachments && user.Attachments.length && user.Attachments.indexOf(req.body._id)>-1){
                    user.Attachments.splice(user.Attachments.indexOf(req.body._id),1);
                    user.save(function(){cb()})
                }else{
                    cb()
                }
            })
        },
        function (cb) {
            m.findRemove(models.UploadFile, {_id: req.body._id}, res, function (data) {
                console.log(data)
            })
            cb(null, res.send('ok'))
        }
    ]);
};

exports.uploadFile = function (req, res) {
    var params = {}, tempId = 'tempoxyz_' + Math.random().toString(36);
    mkdirp.sync('./public/uploads/' + tempId)
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            params.originalName = file.originalname;
            cb(null, './public/uploads/' + tempId)
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            params.title = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
            params.url = '/uploads/' +  tempId + '/' + file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
        }
    });

    var upload = multer({
        storage: storage
    }).single('file');

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            res.json({error_code: 1, err_desc: err});
            return;
        }
        m.create(models.UploadFile, params, res, res);
    });


};

exports.add_package = function (req, res) {
    var params = m.getBody(req);
    var isNew = true;
    async.waterfall([
        function(cb){
            if (params._id){
                models.Package.findOne({_id: params._id}).exec(function(err, pkg){
                    isNew = false;
                    _.extend(pkg,params)
                    cb(null,pkg)
                });
            }else{
                cb(null, new models.Package(params))
            }
        },
        function(pkg, cb){
            pkg.save(function(){
                cb(null,pkg)
            })
        },
        function(pkg, cb){
            models.Freelancer.findOne({user: req.userId}).populate('service_packages').exec(function(err, freelancer){
                if (!isNew) {
                    return cb(null, freelancer)
                }else{
                    if (!freelancer) freelancer = new models.Freelancer();
                    freelancer.service_packages = freelancer.service_packages || [];
                    freelancer.service_packages.push(pkg);
                    freelancer.save(function(){
                        freelancer.populate('service_packages', function(){
                            cb(null, freelancer)
                        })
                    })
                }
            });
        }
    ],function(err, freelancer){
        res.jsonp(freelancer)
    })
};

exports.my_business_accounts = function (req, res) {
    if (!req.userId) return res.jsonp([]);
    models.BusinessUser.find({user: req.userId}).exec(function(err, business_accounts){
        res.jsonp(business_accounts)
    });
};

exports.get_freelancers = function (req, res) {
    var params = req.query;
    params.registrationStatus = 1;
    if (params.freelancer_type){
        params.freelancer_type = {$in: [params.freelancer_type]}
    };
    if (params.content_type){
        params.content_type = {$in: params.content_type}
    };
    _.each(params, function(value, key){
        if (value instanceof  Array)
            params[key] = {$in: params[key]}
    })
    if (params.experience)
        params.experience = {$gte: parseInt(params.experience)}
    m.find(models.Freelancer, params, res, res, {populate: 'poster'})
};

exports.get_freelancer = function (req, res) {
    m.findOne(models.Freelancer, {_id: req.params.id}, res, res, {populate: 'poster service_packages Attachments contact_detail business_account'})
};

exports.get_current_freelancer = function (req, res) {
    m.findOne(models.Freelancer, {_id: req.userId}, res, res, {populate: 'poster service_packages Attachments contact_detail business_account'})
};

exports.freelancer_views_count = function (req, res) {
    var q = {freelancer: req.params.id}
    if (req.query.days) {
        var d = new Date();
        d.setDate(d.getDate()-parseInt(req.query.days));
        q.created_at = {$gte: d};
    }
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