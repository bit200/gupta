'use strict';
var index = require('../controllers/index');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/', index.index);
    app.get('/admin', index.admin);
    
    app.get('/get-content', index.get_content);
    app.get('/get-filters', index.get_filters);
    
    app.get('/get-agency', auth.checkIfUser, index.get_agency);
    app.get('/get-client',auth.token, index.get_client);

};

