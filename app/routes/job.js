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
    
    app.get('/api/info/:model/:_id', job.get_info)

    app.get('/api/job/:_id', job.getInfo)
    app.put('/api/job', job.update)

    app.post('/api/job-apply', auth.freelancer_token, job.applyJob)
    app.get('/api/job-apply/reject/:_id', auth.token, job.rejectJobApply)
    app.get('/api/job-stats/:_id', job.job_stats)
    app.put('/api/job-apply', auth.freelancer_token, job.applyJobUpdate)
    app.delete('/api/job-apply', auth.token, job.applyJobRemove)
    app.get('/api/job-apply/:job_id', auth.freelancer_token, job.getApplyInfo)
    app.get('/api/job-apply/:_id/pub', auth.freelancer_token, job.apply_detailed_pub)
    
    app.get('/api/job/detailed/:_id', job.job_detailed)
    // app.get('/api/job/detailed/me/:_id', auth.token, job.job_detailed_me)

    
    job.fn('/api/jobs/all', null, 'Job', '{}'
        , {populate: 'user', sort: '-created_at'}, app)

    job.fn('/api/jobs/popular', null, 'Job', '{}'
        , {populate: 'user', sort: '-created_at'}, app)

    job.fn('/api/jobs/buyer/open', auth.token, 'JobApply', '{ buyer: this.userId }'
        , {populate: 'job freelancer', sort: '-created_at'}, app)

    job.fn('/api/jobs/buyer/my', auth.token, 'Job', '{ user: this.userId }'
        , {populate: 'job freelancer', sort: '-created_at'}, app)

    job.fn('/api/jobs/buyer/ongoing', auth.token, 'Contract', '{ buyer: this.userId }'
        , {populate: 'freelancer job', sort: '-created_at'}, app)

    job.fn('/api/jobs/buyer/closed', auth.token, 'Contract', '{ buyer: this.userId, status: "closed" }'
        , {populate: 'freelancer job', sort: '-created_at'}, app)


    job.fn('/api/jobs/seller/open', auth.token, 'JobApply', '{ seller: this.userId }'
        , {populate: 'job freelancer buyer', sort: '-created_at'}, app)

    job.fn('/api/jobs/seller/ongoing', auth.token, 'Contract', '{ seller: this.userId }'
        , {populate: 'job buyer', sort: '-created_at'}, app)

    job.fn('/api/jobs/seller/closed', auth.token, 'Contract', '{ seller: this.userId, status: "closed" }'
        , {populate: 'job buyer', sort: '-created_at'}, app)
};