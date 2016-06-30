var models = require('../db')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    mail = require('../mail'),
    _ = require('underscore'),
    mkdirp = require('mkdirp'),
    multer = require('multer'),
    async = require('async');


exports.delete_package = function (req, res) {
    models.Package.find({_id: req.params.id}).remove(function(){
        models.Freelancer.findOne({service_packages: {$in: [req.params.id]}}).exec(function(err, freelancer){
            if (freelancer){
                freelancer.splice(freelancer.service_packages.indexOf(req.params.id),1)
                freelancer.save()
            }
        });
        res.send(200)     
    })
};
exports.add_update_package = function (req, res) {
    var packg;
    var getPackage = function(req, cb){
        if (packg) return cb();
        if (req.body.id)
            models.Package.findOne({_id: parseInt(req.body.id)}).exec(function(err, pkg){
                packg = pkg
                cb()
            });
        else new models.Package().save(function(err, pkg){
            packg = pkg
            cb()
        });
    };

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            getPackage(req,function() {
                var path = config.root + '/public/uploads/packages/' + packg._id;
                mkdirp.sync(path);
                cb(null, path)
            })
        },
        filename: function (req, file, cb) {
            cb(null, new Date().getTime() + '_' + file.originalname)
        }
    });

    var upload = multer({
        storage: storage
    }).single('file');

    upload(req, res, function (err) {
        getPackage(req, function(){
            new models.Attachment({
                originalName: req.file.originalname,
                name: req.file.filename,
                path: 'packages/'+ packg._id
            }).save(function(err, attach){
                delete req.body.id
                req.body.preview = attach;
                packg = _.extend(packg,req.body);
                packg.save(function(err,pkg){
                    pkg.populate('preview', function(){
                        res.jsonp(pkg)
                    })
                });
            })
        });
    });
};
