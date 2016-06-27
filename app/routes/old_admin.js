// 'use strict';
// var admin = require('../controllers/admin');
//
//
// module.exports = function (app) {
//     var auth = require('./middlewares/auth');
//     app.get('/admin/sellers', auth.admin_only, admin.get_sellers);
//     app.get('/admin/seller/:id', auth.admin_only, admin.get_seller);
//     app.get('/admin/registration/approve/:id', auth.admin_only, admin.approve_registration);
//     app.get('/admin/registration/reject/:id', auth.admin_only, admin.reject_registration);
//
//
//     app.get('/get-users', auth.admin_only, admin.get_users);
//     app.get('/get-business-users', auth.admin_only, admin.get_business_users);
//     app.get('/get-job', auth.admin_only, admin.get_job);
//     app.get('/approved', auth.admin_only, admin.approved);
//     app.get('/reject-agency', auth.admin_only, admin.reject_agency);
//     app.get('/approve-job', auth.admin_only, admin.approve_job);
//     app.get('/reject-job', auth.admin_only, admin.reject_job);
//     app.get('/suggest-edit-job', auth.admin_only, admin.suggest_edit_job);
//     app.get('/reject', auth.admin_only, admin.reject);
//     app.post('/add-seller', auth.admin_only, admin.add_seller);
// };
module.exports =function(app) {};