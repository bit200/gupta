'use strict';
var _admin = require('../controllers/admin');


module.exports = function (app) {
    app.post('/admin/login', _admin.login);
    app.get('/admin/api/sellers', _admin.get_sellers);
    app.get('/admin/api/seller/:id', _admin.get_seller);
    app.get('/admin/api/registration/approve/:id', _admin.approve_registration);
    app.get('/admin/api/registration/reject/:id', _admin.reject_registration);

};
