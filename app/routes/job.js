'use strict';
var job = require('../controllers/job'),
    // models = require('../models'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/job', auth.token, job.add_job);
    app.post('/get-job', auth.token, job.get_job);
    app.get('/get-my-job', auth.token, job.get_my_job);
    app.get('/api/info/:model/:_id', job.get_info);
    app.get('/api/job/:_id', job.getInfo);
    app.post('/api/job/attach/:id', job.job_attach_file);
    app.put('/api/job', auth.token, job.update);
    app.put('/api/jobs', job.get_jobs);

    app.post('/api/job-apply', auth.freelancer_token, job.applyJob);
    app.get('/api/job-apply/reject/:_id', auth.token, job.rejectJobApply);
    app.get('/api/job-stats/:_id', job.job_stats);
    app.put('/api/job-apply', auth.freelancer_token, job.applyJobUpdate);
    app.delete('/api/job-apply', auth.token, job.applyJobRemove);
    app.get('/api/job-apply/:job_id', auth.freelancer_free, job.getApplyInfo);
    app.get('/api/job-apply/:apply_id/pub', auth.freelancer_free, job.apply_detailed_pub);

    app.get('/api/questionnaire', job.get_questionnaire);
    
    app.get('/api/job/detailed/:_id', job.job_detailed);
    // app.get('/api/job/detailed/me/:_id', auth.token, job.job_detailed_me)
    
    
    app.get('/api/count/buyer', job.job_count_buyer);
    app.get('/api/count/seller', job.job_count_seller);
    
    
    app.get('/api/jobs', job.job);
    app.post('/api/jobs', job.job);
    app.get('/api/jobs/filter', job.filter_job);

    app.get('/job/favorite/add', auth.token, job.add_favorite);
    app.get('/job/favorite/remove', auth.token, job.remove_favorite);
    app.get('/job/check_favorite', auth.token, job.check_job_favorite);
    app.get('/job/favorites', auth.token, job.get_favorites_jobs);


    job.fn('/api/jobs/all', null, 'Job', '{job_visibility: true}'
        , {populate: 'user', sort: '-created_at'}, app);

    job.fn('/api/jobs/popular', null, 'Job', '{}'
        , {populate: 'user', sort: '-created_at'}, app);


    job.fn('/api/jobs/buyer/open', auth.token, 'JobApply', '{ status: {$in: ["No Applicants","Pending Approval", "Service Providers have applied", "Contract started", "Rejected by seller", "Rejected by buyer"]} }'
        , {populate: 'job freelancer contract', sort: '-created_at'}, app);

    job.fn('/api/jobs/buyer/open/new', auth.token, 'JobApply', '{ buyer: this.userId, status: "No Applicants" }'
        , {populate: 'job freelancer contract', sort: '-created_at'}, app);

    job.fn('/api/jobs/buyer/open/active', auth.token, 'JobApply', '{ buyer: this.userId, status: {$nin: ["No Applicants", "Rejected by seller", "Rejected by buyer", "Contract started"]} }'
        , {populate: 'job freelancer contract', sort: '-created_at'}, app);

    job.fn('/api/jobs/buyer/open/rejected', auth.token, 'JobApply', '{ buyer: this.userId, status: {$in: ["Rejected by seller", "Rejected by buyer"]} }'
        , {populate: 'job freelancer contract', sort: '-created_at'}, app);

    job.fn('/api/jobs/buyer/my', auth.token, 'Job', '{ user: this.userId }'
        , {populate: 'job freelancer', sort: '-created_at'}, app);

    

    job.fn('/api/jobs/buyer/ongoing', auth.token, 'Contract', '{ buyer: this.userId, status: {$in: ["Ongoing", "Marked as completed", "Paused"]}}'
        , {populate: 'freelancer job', sort: '-created_at'}, app);

    job.fn('/api/jobs/buyer/closed', auth.token, 'Contract', '{ buyer: this.userId, status: "Closed" }'
        , {populate: 'freelancer job', sort: '-created_at'}, app);



    job.fn('/api/jobs/seller/open', auth.token, 'JobApply', '{ seller: this.userId, status: {$nin: ["Rejected by seller", "Rejected by buyer"]} }'
        , {populate: 'job freelancer buyer contract', sort: '-created_at'}, app)

    job.fn('/api/jobs/seller/open/new', auth.token, 'Job', '{ seller: this.userId, status: {$in: ["No Applicants"]} }'
        , {populate: 'job freelancer buyer contract', sort: '-created_at'}, app);

    job.fn('/api/jobs/seller/open/active', auth.token, 'JobApply', '{ seller: this.userId, status: {$nin: ["No Applicants", "Rejected by seller", "Rejected by buyer", "Contract started"]} }'
        , {populate: 'job freelancer buyer contract', sort: '-created_at'}, app);

    job.fn('/api/jobs/seller/open/rejected', auth.token, 'JobApply', '{ seller: this.userId, status: {$in: ["Rejected by seller", "Rejected by buyer"]} }'
        , {populate: 'job freelancer buyer contract', sort: '-created_at'}, app);



        job.fn('/api/jobs/seller/ongoing', auth.token, 'Contract', '{ seller: this.userId, status: {$in: ["Ongoing", "Marked as completed", "Paused"]} }'
        , {populate: 'job buyer', sort: '-created_at'}, app);

    job.fn('/api/jobs/seller/closed', auth.token, 'Contract', '{ seller: this.userId, status: "Closed" }'
        , {populate: 'job buyer', sort: '-created_at'}, app)
};