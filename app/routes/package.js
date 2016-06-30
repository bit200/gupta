'use strict';
var packageCtrl = require('../controllers/package');

module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/api/package', packageCtrl.add_update_package);
    app.delete('/api/package/:id', packageCtrl.delete_package);
};
