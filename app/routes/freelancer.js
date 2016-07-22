'use strict';
var freelancer = require('../controllers/freelancer');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/api/my/favorites', auth.token, freelancer.get_favorites);
    app.get('/api/freelancer/me', auth.token, freelancer.get_current_freelancer);
    
    app.get('/api/freelancer/:id/jobs_count', auth.token, freelancer.get_jobs_count);
    
    app.get('/api/freelancer/:id', freelancer.get_freelancer);
    app.get('/api/freelancers', freelancer.get_freelancers);
    app.get('/api/freelancers/count_rating', freelancer.get_freelancers);
    app.get('/api/my/business_accounts', auth.checkIfUser, freelancer.my_business_accounts);
    app.post('/api/claim_request', auth.checkIfUser, freelancer.claim_request);
    app.post('/api/freelancer/request', auth.checkIfUser, freelancer.freelancer_request);
    app.post('/api/freelancer/contact_detail', freelancer.add_update_contact_detail);
    app.get('/api/freelancers/search', freelancer.search_freelancers);
    app.get('/api/freelancer/:id/views', freelancer.freelancer_views_count);

    app.post('/api/freelancer/:id/views', freelancer.add_freelancer_view);
    app.get('/api/freelancer/:id/favorite/add', auth.token, freelancer.add_favorite);

    app.get('/api/freelancer/:id/favorite/remove', auth.token, freelancer.remove_favorite);
    app.get('/api/freelancer/:id/check_favorite', auth.token, freelancer.check_favorite);

    app.post('/api/freelancer/past_client', freelancer.past_client);
    app.delete('/api/freelancer/past_client/:id', freelancer.delete_past_client);
    app.get('/api/get-clients', freelancer.get_clients);
};