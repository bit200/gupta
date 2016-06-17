'use strict';
var admin = require('../controllers/admin');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/generate-admin', admin.generate_admin);
    app.get('/get-users', auth.admin_only, admin.get_users);
    app.get('/get-business-users', auth.admin_only, admin.get_business_users);
    app.get('/get-job', auth.admin_only, admin.get_job);
    app.get('/approved', auth.admin_only, admin.approved);
    app.get('/approve-agency', auth.admin_only, admin.approve_agency);
    app.get('/reject-agency', auth.admin_only, admin.reject_agency);    
    app.get('/approve-job', auth.admin_only, admin.approve_job);
    app.get('/reject-job', auth.admin_only, admin.reject_job);
    app.get('/reject', auth.admin_only, admin.reject);
};