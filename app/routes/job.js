'use strict';
var job = require('../controllers/job'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/job', auth.token, job.add_job);
    app.post('/get-job', auth.token, job.get_job);
    app.get('/get-my-job', auth.token, job.get_my_job);
    
    var all_query = {}
    app.get('/api/jobs/all', job.list(all_query))
    app.get('/api/jobs/all/count', job.count(all_query))
};