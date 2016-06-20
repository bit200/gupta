'use strict';
var users = require('../controllers/users');

module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/me', auth.token,  users.me);
    app.get('/users', auth.admin_only,  users.list);
    app.get('/get-user', auth.token,  users.get_user);
    app.get('/send-restore',  users.send_restore);
    app.get('/restore',  users.restore);
    app.post('/update-password', auth.token, users.update_password);
    app.get('/send-confirm',  users.send_confirm);
    app.get('/confirm',  users.confirm);
    app.post('/upload-profile',auth.token, users.upload_profile);
    app.post('/facebookSignin', users.facebookSignin);
    app.post('/linkedinSignin', users.linkedinSignin);
    app.post('/googleSignin', users.googleSignin);
    app.get('/api/checkUnique/', users.check_unique)
    app.get('/api/uniqueName/', users.check_unique_freelancer)
};
