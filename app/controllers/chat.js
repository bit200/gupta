var models = require('../db')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    _ = require('underscore'),
    mkdirp = require('mkdirp'),
    multer = require('multer'),
    async = require('async');


exports.createRoom = function (req, res) {
    var params = m.getBody(req);
    if (params.params.buyer == params.params.seller) {
        m.ecb(400, 'Buyer and seller must not have the same ID', res)
    } else {
        m.findCreate(models.ChatRoom, params.params, params.params, res, function (chat) {
            m.scb(chat, res)

        })
    }
};

// m.findCreate(models.ChatRoom, {name: 'Name', buyer: 100002,  seller: 100001,  job: 100007,  messages: []}, {});

exports.createMsg = function (req, res) {
    var params = m.getBody(req);
    m.create(models.ChatMessage, params, res, res, {})
};

exports.getMsg = function (req, res) {
    m.find(models.ChatMessage, {user: req.userId}, res, res, {populate: 'user contract'})
};

exports.allMsgs = function (req, res) {
    m.find(models.ChatRoom, {_id: req.params.id, $or: [{buyer: req.userId}, {seller: req.userId}]}, res, res)
};

exports.allRooms = function (req, res) {
    m.find(models.ChatRoom, {$or: [{buyer: req.userId}, {seller: req.userId}]}, res, res, {populate: 'job'})
};

exports.attachFiles = function (req, res) {
    var attachments = [];
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var path = config.root + '/public/uploads/chat/' + req.body.room + '/';
            mkdirp.sync(path);
            cb(null, path)
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
        async.forEach(req.files, function (file, cb) {
            new models.Attachment({
                originalName: file.originalname,
                name: file.filename,
                path: 'chat/' + req.body.room
            }).save(function (err, attach) {
                attachments.push(attach);
                cb();
            })
        }, function () {
            m.scb(req.files, res);
        });

    });
};

