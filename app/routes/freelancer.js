'use strict';
var freelancer = require('../controllers/freelancer');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/api/freelancer/:id', freelancer.get_freelancer);
    app.get('/api/freelancers', freelancer.get_freelancers);
    app.get('/api/my/business_accounts', auth.token, freelancer.my_business_accounts);
    app.post('/api/claim_request', auth.token, freelancer.claim_request);
    app.post('/api/freelancer/request', auth.checkIfUser, freelancer.freelancer_request);

    app.get('/api/freelancer/:id/views', freelancer.freelancer_views_count);
    app.post('/api/freelancer/:id/views', freelancer.add_freelancer_view);

    app.get('/api/freelancer/:id/favorite/add', auth.token, freelancer.add_favorite);
    app.get('/api/freelancer/:id/favorite/remove', auth.token, freelancer.remove_favorite);
    app.get('/api/freelancer/:id/check_favorite', auth.token, freelancer.check_favorite);

    app.post('/add-package', auth.checkIfUser, freelancer.add_package);
    app.post('/uploadFile', auth.checkIfUser, freelancer.uploadFile);
    app.delete('/deleteFile', auth.checkIfUser, freelancer.deleteFile);
};