'use strict';
var index = require('../controllers/index');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/dev', index.dev);
    app.get('/api/common_filters', index.common_filters);
    app.get('/api/search', index.search);
    app.get('/admin', index.admin);
    
    app.get('/get-content', index.get_content);
    app.get('/get-filters', index.get_filters);
    
    app.get('/get-agency', auth.checkIfUser, index.get_agency);
    app.get('/get-client',auth.token, index.get_client);

};

