var models = require('../db')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    _ = require('underscore'),
    mkdirp = require('mkdirp'),
    multer = require('multer'),
    async = require('async');


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

exports.deleteFile = function (req, res) {
    async.series([
        function (cb) {
            m.find(models.UploadFile, {_id: req.body._id}, res, function (responce) {
                fs.unlink("." + responce[0].url, function (err) {
                    console.log(err);
                });
            });
            cb(null)
        },
        function(cb){
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
    var params = {};
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            console.log(file, "There!!!");
            params.originalName = file.originalname;
            cb(null, './public/uploads/' + req.userId.toString())
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            console.log(file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1], "there2");
            params.title = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
            params.url = '/public/uploads/' + req.userId.toString() + '/' + file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])

        }
    });

    var upload = multer({ //multer settings
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

exports.add_freelancer = function (req, res) {
    var params = m.getBody(req);
    params.user = req.userId;
    console.log(params.work)
    var wQ = {}
    if (params.work && params.work._id) wQ._id =  params.work._id
    m.findCreateUpdate(models.Work, {_id: params.work._id} ,params.work, res, function (work) {
        params.work = work._id;
        var cQ = {}
        if (params.contact_detail && params.contact_detail._id) cQ._id =  params.contact_detail._id;
        m.findCreateUpdate(models.ContactDetail, cQ, params.contact_detail, res, function (contact_detail) {
            params.contact_detail = contact_detail._id
            var fQ = {};
            if (params._id) fQ._id =  params._id
            m.findCreateUpdate(models.Freelancer, fQ, params, res, function (freelancer) {
                m.findUpdate(models.User, {_id: req.userId}, {freelancer: freelancer._id}, res, m.scb(freelancer, res), {populate: [{
                    path: 'poster'
                },{
                    path: 'work'
                },{
                    path: 'service_packages'
                },{
                    path: 'contact_detail'
                },{
                    path: 'Attachments'
                }]
                })
            })
        })
    });
};

exports.get_freelancer = function (req, res) {
    var params = m.getBody(req);
    if (params.experience)
        params.experience = {'$gte': parseInt(params.experience)};
    if (params.package == 'true') {
        params.service_packages = {'$exists': true, '$not': {'$size': 0}};
        delete params.package
    }
    if (params.package == 'false') {
        params.service_packages = {'$exists': false};
        delete params.package
    }

    log('params', params);
    m.find(models.Freelancer, params, res, res, {populate: 'user contact_detail work poster'})
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

exports.get_my_job = function (req, res) {
    m.find(models.Job, {user: req.userId}, res, res, {populate: 'user contract'})
};