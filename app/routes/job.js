'use strict';
var job = require('../controllers/job'),
    // models = require('../models'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/job', job.add_job);
    app.post('/get-job', auth.token, job.get_job);
    app.get('/get-my-job', auth.token, job.get_my_job);

    app.get('/api/job/:_id', job.getInfo)
    app.put('/api/job', job.update)

    app.post('/api/job-apply', auth.freelancer_token, job.applyJob)
    app.get('/api/job-apply/reject/:_id', auth.token, job.rejectJobApply)
    app.get('/api/job-stats/:_id', job.job_stats)
    app.put('/api/job-apply', auth.freelancer_token, job.applyJobUpdate)
    app.delete('/api/job-apply', job.applyJobRemove)
    app.get('/api/job-apply/:job_id', auth.freelancer_token, job.getApplyInfo)


    job.fn('/api/jobs/all', auth.token, 'Job', '{}'
        , {populate: 'user', sort: '-created_at'}, app)

    job.fn('/api/jobs/buyer/open', auth.token, 'JobApply', '{ buyer: this.userId }'
        , {populate: 'job freelancer', sort: '-created_at'}, app)

    job.fn('/api/jobs/buyer/ongoing', auth.token, 'Contract', '{ buyer: this.userId }'
        , {populate: 'freelancer job', sort: '-created_at'}, app)

    job.fn('/api/jobs/buyer/closed', auth.token, 'Contract', '{ buyer: this.userId }'
        , {populate: 'user', sort: '-created_at'}, app)


    job.fn('/api/jobs/seller/open', auth.token, 'JobApply', '{ seller: this.userId }'
        , {populate: 'job freelancer', sort: '-created_at'}, app)

    job.fn('/api/jobs/seller/ongoing', auth.token, 'Contract', '{ seller: this.userId }'
        , {populate: 'job buyer', sort: '-created_at'}, app)

    job.fn('/api/jobs/seller/closed', auth.token, 'Contract', '{ seller: this.userId }'
        , {populate: 'user', sort: '-created_at'}, app)
};