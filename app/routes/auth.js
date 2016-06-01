'use strict';
var _auth = require('../controllers/auth');

module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/tokens', auth.admin_only,  _auth.tokens_list);
    app.get('/refresh-token',  _auth.refresh_token);
    app.get('/sign-in',  _auth.sign_in);
    app.post('/sign-up',  _auth.sign_up);
    app.get('/generate-admin',  _auth.generate_admin);
};
