'use strict';
var freelancer = require('../controllers/freelancer');


module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.get('/freelancers', freelancer.get_freelancers);
    app.post('/freelancer/request', auth.checkIfUser, freelancer.freelancer_request);
    app.post('/add-package', auth.checkIfUser, freelancer.add_package);
    app.post('/uploadFile', auth.checkIfUser, freelancer.uploadFile);
    app.delete('/deleteFile', auth.checkIfUser, freelancer.deleteFile);
};