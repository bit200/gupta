var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , fs = require('fs')
    , mkdirp = require('mkdirp')
    , multer = require('multer')
    , async = require('async');


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
    // var params = m.getBody(req);
    // params.user = req.userId;
    // m.create(models.Work, params.work, res, function (work) {
    //     params.work = work._id;
    //     m.create(models.ContactDetail, params.contact, res, function (contact) {
    //         params.contact = contact._id
    //         m.create(models.Freelancer, params, res, function (freelancer) {
    //             m.findUpdate(models.User, {_id: req.userId}, {freelancer: freelancer._id}, res, m.scb(freelancer, res))
    //         })
    //     })
    // });
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

    async.parallel(function (e, r) {
        m.create(models.Freelancer, params, res, function(freelancer){
            m.findUpdate(models.User, {_id: params.userId}, {freelancer: freelancer._id}, res, m.scb(freelancer, res))
        })
    })
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
    m.find(models.Freelancer, params, res, res, {populate: 'user contact_detail work'})
};

exports.add_package = function (req, res) {
    var params = m.getBody(req);
    m.create(models.Package, params, res, res)
};

exports.get_my_job = function (req, res) {
    m.find(models.Job, {user: req.userId}, res, res, {populate: 'user contract'})
};