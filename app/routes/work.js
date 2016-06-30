'use strict';
var workCtrl = require('../controllers/work');

module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/api/work', workCtrl.add_update_work);
    app.delete('/api/work/attachment/:id', workCtrl.delete_work_attachment);
};
