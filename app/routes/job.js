'use strict';
var job = require('../controllers/job');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/job', auth.token, job.add_job);
    app.post('/get-job', auth.token, job.get_job);
    app.post('/freelancer', auth.token, job.add_freelancer);
    app.post('/add-package', auth.token, job.add_package);
    app.get('/freelancer', auth.token, job.get_freelancer);
};