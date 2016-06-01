var mongoose = require('mongoose')
    , fs = require('fs')
    , config = require('./config')
    , models = {};

fs.readdirSync(config.root_app + '/models').forEach(_export_name);

function _export_name (file) {
    var modelName = file.split('.js')[0];
    if (modelName != 'export') {
        models[modelName] = mongoose.model(modelName)
    }
}

module.exports = models;