var models = require('../db')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    _ = require('underscore'),
    mkdirp = require('mkdirp'),
    multer = require('multer'),
    async = require('async');


exports.createMsg = function (req, res) {
    var params = m.getBody(req);
    m.create(models.ChatMessage, params, res, res,{})
};

exports.getMsg = function (req, res) {
    m.find(models.ChatMessage, {user: req.userId}, res, res, {populate: 'user contract'})
};