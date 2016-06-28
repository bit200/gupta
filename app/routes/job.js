'use strict';
var job = require('../controllers/job'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/job', auth.token, job.add_job);
    app.post('/get-job', auth.token, job.get_job);
    app.get('/get-my-job', auth.token, job.get_my_job);

    app.get('/api/job/:_id', job.getInfo)
    app.put('/api/job', job.update)

    app.post('/api/job-apply', auth.freelancer_token, job.applyJob)
    app.get('/api/job-apply/reject/:_id', auth.token, job.rejectJobApply)
    app.get('/api/job-stats/:_id', job.job_stats)
    app.put('/api/job-apply', job.applyJobUpdate)
    app.delete('/api/job-apply', job.applyJobRemove)
    app.get('/api/job-apply/:job_id', auth.freelancer_token, job.getApplyInfo)

    var all_query = {}
    app.get('/api/jobs/all', job.list(all_query))
    app.get('/api/jobs/all/count', job.count(all_query))

    app.get('/api/jobs/buyer/open', auth.token, job.buyer_open)
    app.get('/api/jobs/buyer/open/count', auth.token, job.buyer_open_count)

    app.get('/api/jobs/seller/open', auth.token, job.seller_open)
    app.get('/api/jobs/seller/open/count', auth.token, job.seller_open_count)
};