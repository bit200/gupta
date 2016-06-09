'use strict';
var admin = require('../controllers/admin');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/generate-admin', admin.generate_admin);
    app.get('/get-users', auth.admin_only, admin.get_users);
    app.get('/get-business-users', auth.admin_only, admin.get_business_users);
    app.get('/approved', auth.admin_only, admin.approved);
    app.get('/approved-agency', auth.admin_only, admin.approved_agency);
    app.get('/reject', auth.admin_only, admin.reject);
};