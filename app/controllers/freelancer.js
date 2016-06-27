var models = require('../db')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    mail = require('../mail'),
    _ = require('underscore'),
    mkdirp = require('mkdirp'),
    multer = require('multer'),
    async = require('async');

exports.freelancer_request = function (req, res) {
    var params = m.getBody(req);
    async.parallel([
        function(cb){
            if (!params.newPackages) return cb()
            async.forEach(params.newPackages, function(pkg, ct){
                m.create(models.Package, pkg, res, function (saved_pkg) {
                    if (!params.service_packages) params.service_packages = [];
                    params.service_packages.push(saved_pkg._id);
                    ct();
                })
            },cb)
        },
        function(cb){
            if (!params.work) return cb()
            m.create(models.Work, params.work, res, function (work) {
                params.work = work._id;
                cb()
            })
        },function(cb){
            if (!params.contact_detail) return cb()
            m.create(models.ContactDetail, params.contact_detail, res, function (contact_detail) {
                params.contact_detail = contact_detail._id
                cb();
            })
        }
    ], function(){
        if (req.userId){
            m.findCreateUpdate(models.Freelancer, {_id: req.userId}, params, res, function(freelancer){
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
    });
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
    models.BusinessUser.find({user: req.userId}).exec(function(err, business_accounts){
        res.jsonp(business_accounts)
    });
};

exports.get_freelancers = function (req, res) {
    var params = m.getBody(req);
    params.registrationStatus = 1;
    m.find(models.Freelancer, params, res, res)
};

exports.claim_request = function(req,res){
    var params = m.getBody(req);
    params.user = req.userId;
    new models.BusinessUser(params).save(function(business_user){
        mail.newClaim(business_user);
        res.json(business_user);
    })
};