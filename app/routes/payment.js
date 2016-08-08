'use strict';
var payment = require('../controllers/payment');

module.exports = function (app) {
    var auth = require('./middlewares/auth');
    app.post('/payments/capture', auth.token, payment.capture_payment);
    app.get('/payments', payment.get_payments);
};
