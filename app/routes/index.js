'use strict';
var index = require('../controllers/index');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/', index.index);
    app.get('/admin', index.admin);
    app.get('/create-filter', index.create_filter);
    app.get('/get-content',auth.token, index.get_content);
    app.get('/get-agency',auth.token, index.get_agency);
    app.post('/request-business', auth.token, index.request_business);

};

