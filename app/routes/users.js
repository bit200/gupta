'use strict';
var users = require('../controllers/users');

module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/api/user/update-password', auth.token, users.update_password);
    app.post('/api/user/first-update-password', users.update_password);
    app.get('/api/user/first-signIn', users.first_signIn);
    app.put('/api/user/profile',auth.token, users.update_profile);
    app.get('/api/user/me', auth.token,  users.me);
    app.get('/api/restore',  users.restore);
    app.get('/api/send-restore',  users.send_restore);


    app.get('/users', auth.admin_only,  users.list);
    app.get('/get-user', auth.token,  users.get_user);
    app.get('/send-confirm',  users.send_confirm);
    app.get('/confirm',  users.confirm);
    app.post('/facebookSignin', users.facebookSignin);
    app.post('/linkedinSignin', users.linkedinSignin);
    app.post('/googleSignin', users.googleSignin);
    app.get('/api/checkUnique/', users.check_unique)
    app.get('/api/uniqueName/', users.check_unique_freelancer)
    app.get('/api/me-ids', auth.freelancer_token, users.me_ids)
    app.get('/api/create-test-user',users.create_test_user)
};
