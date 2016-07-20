'use strict';
var _auth = require('../controllers/auth');

module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/tokens',  _auth.tokens_list);
    app.get('/refresh-token',  _auth.refresh_token);
    app.get('/sign-in',  _auth.sign_in);
    app.post('/sign-up',  _auth.sign_up);
    app.post('/sign-up-social',  _auth.sign_up_social);
};
