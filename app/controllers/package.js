var models = require('../db')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    mail = require('../mail'),
    _ = require('underscore'),
    mkdirp = require('mkdirp'),
    multer = require('multer'),
    async = require('async');


var deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
exports.delete_package = function (req, res) {
    models.Package.find({_id: req.params.id}).remove(function(){
        models.Freelancer.findOne({service_packages: {$in: [req.params.id]}}).exec(function(err, freelancer){
            if (freelancer){
                freelancer.splice(freelancer.service_packages.indexOf(req.params.id),1)
                freelancer.save()
            }
        });
        deleteFolderRecursive(config.root + '/public/uploads/packages/' + req.params.id);
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
            req.body.preview = file.originalname;
            cb(null, req.body.preview)
        }
    });

    var upload = multer({
        storage: storage
    }).any();

    upload(req, res, function (err) {
        getPackage(req, function(){
            delete req.body.id
            packg = _.extend(packg,req.body);
            packg.save(function(err,pkg){
                res.jsonp(pkg)
            });
        });
    });
};
