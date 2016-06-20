'use strict';
var job = require('../controllers/job'),
multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/job', auth.token, job.add_job);
    app.post('/get-job', auth.token, job.get_job);
    app.post('/freelancer', auth.token, job.add_freelancer);
    app.post('/add-package', auth.token, job.add_package);
    app.post('/uploadFile',auth.token,job.uploadFile);
    app.get('/freelancer', auth.token, job.get_freelancer);
    app.get('/get-my-job', job.get_my_job);
};