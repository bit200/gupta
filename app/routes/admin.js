'use strict';
var _admin = require('../controllers/admin');


module.exports = function (app) {
    app.post('/admin/login', _admin.login);
    app.get('/admin/api/sellers', _admin.get_sellers);
    app.get('/admin/api/seller/:id', _admin.get_seller);
    
    app.post('/admin/api/registration/approve/:id', _admin.approve_registration);
    app.post('/admin/api/registration/reject/:id', _admin.reject_registration);
    
    app.get('/admin/api/business_accounts', _admin.business_accounts);
    
    app.post('/admin/api/business_accounts/approve/:id', _admin.approve_account);
    app.post('/admin/api/business_accounts/reject/:id', _admin.reject_account);
    
};
