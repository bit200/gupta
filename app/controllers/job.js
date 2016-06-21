var models = require('../db')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    multer = require('multer'),
    async = require('async');


exports.add_job = function (req, res) {
    var params = m.getBody(req);
    params.user = req.userId;
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
            params.originalName = file.originalname;
            cb(null, './public/uploads/' + req.userId.toString())
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
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

    //UserController = function() {};
    // We are able to access req.files.file thanks to
    // the multiparty middleware
    //var file = req.files;
    //console.log(file);


    //var params = m.getBody(req);
    //console.log(params)
    //var base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");
    //
    //fs.writeFile("./public/uploads/"+req.userId.toString()+"/out.png", base64Data, 'base64', function(err) {
    //    if(err){
    //        console.log(err);
    //    }else{
    //        res.send(JSON.stringify({'status': 1, 'msg': 'Image Uploaded'}));
    //    }
    //});


};

exports.add_freelancer = function (req, res) {
    var params = m.getBody(req);
    params.user = req.userId;
    m.create(models.Freelancer, params, res, res)
};

exports.get_freelancer = function (req, res) {
    var params = m.getBody(req);
    m.find(models.Freelancer, params, res, res, {populate: 'user'})
};

exports.add_package = function (req, res) {
    var params = m.getBody(req);
    m.create(models.Package, params, res, res)
};

exports.get_my_job = function (req, res) {
    var params = m.getBody(req);
    m.find(models.Job, {user: req.userId}, res, res, {populate: 'user'})
};