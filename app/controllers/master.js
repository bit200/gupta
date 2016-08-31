var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , _ = require('lodash')
    , async = require('async');
var randomstring = require("randomstring");

exports.make_master_data = function (req, res) {

    models.MasterData.remove({}, function(err,resp){

    });
    m.create(models.MasterData, {
        name: 'Languages',
        nameType: 'Languages'
    });

    m.create(models.MasterData, {
        name: 'Locations',
        nameType: 'Location'
    });

    m.scb('OK', res);

};