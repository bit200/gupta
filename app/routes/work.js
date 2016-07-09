'use strict';
var workCtrl = require('../controllers/work');

module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/api/work', workCtrl.add_update_work);
    app.post('/api/work/sample_work', workCtrl.add_sample_work);
    app.delete('/api/work/sample_work/:id', workCtrl.delete_sample_work);
};
