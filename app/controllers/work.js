var models = require('../db')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    mail = require('../mail'),
    _ = require('underscore'),
    mkdirp = require('mkdirp'),
    multer = require('multer'),
    async = require('async');


exports.delete_work_attachment = function(req, res) {
    models.Attachment.remove({_id: req.params.id}).exec(function(){
        models.Work.findOne({attachments: {$in: [req.params.id]}}).exec(function(err, work){
            if (work){
                work.attachments.splice(work.attachments.indexOf(req.params.id), 1)
                work.save()
            };
            res.send(200)
        });
    })
};

exports.delete_sample_work = function(req, res) {
    models.SampleWork.findOne({_id: req.params.id}).exec(function(err, sample_work){
        sample_work.remove(function(){
            res.send(200)
        });
    });
};

exports.add_sample_work = function(req, res) {
    var sampleWork;
    var getSampleWork = function(req, cb){
        if (sampleWork) return cb();
        if (req.body.id)
            models.SampleWork.findOne({_id: parseInt(req.body.id)}).exec(function(err, workT){
                sampleWork = workT;
                cb()
            });
        else new models.SampleWork().save(function(err, workT){
            sampleWork = workT;
            cb()
        });
    };
    var attachments = [];
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            getSampleWork(req,function() {
                var path = config.root + '/public/uploads/sample_works/' + sampleWork._id;
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
        getSampleWork(req, function(){
            console.log(req.files)
            async.forEach(req.files, function(file, cb){
                new models.Attachment({
                    originalName: file.originalname,
                    name: file.filename,
                    path: 'sample_works/'+ sampleWork._id
                }).save(function(err, attach){
                    attachments.push(attach);
                    cb();
                })
            }, function(){
                delete req.body.id;
                sampleWork = _.extend(sampleWork,req.body);
                sampleWork.attachments = (sampleWork.attachments || []).concat(attachments);
                sampleWork.save(function(err,sampleWork){
                    sampleWork.populate('attachments',function(err, sampleWork){
                        res.jsonp(sampleWork)
                    })
                });
            });
        });
        
    });
};
exports.add_update_work = function(req, res) {
    var work;
    var getWork = function(req, cb){
        if (work) return cb();
        if (req.body.id)
            models.Work.findOne({_id: parseInt(req.body.id)}).exec(function(err, workT){
                work = workT;
                cb()
            });
        else new models.Work().save(function(err, workT){
            work = workT;
            cb()
        });
    };
    getWork(req, function(){
        delete req.body.id;
        work = _.extend(work,req.body);
        work.save(function(err,work){
            work.populate({
                path: 'work_samples',
                populate: {
                    path: 'attachments'
                }
            },function(err,work){
                res.jsonp(work)
            })
        });
    });
};
