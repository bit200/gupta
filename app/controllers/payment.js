var models = require('../db')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    _ = require('underscore'),
    async = require('async');

/// |email:|testXYZonline5@gmail.com  |pass:|testXYZonline
// razorplay/// |pass:| testXYZonline5  |ID:|5weeOmBG7zAWgM  |key_ID| rzp_test_Rwg8wDQEM22Lza |key secret| BQi4QKJXDD1E4VGilt9m4Zzu
///---------------------------------------------------------------------------------------------------
var request = require('request');
var key_id='rzp_test_Rwg8wDQEM22Lza';
var key_secret='BQi4QKJXDD1E4VGilt9m4Zzu';
var paymentsStr='https://'+key_id+':'+key_secret+'@api.razorpay.com/v1/payments/';
///---------------------------------------------------------------------------------------------------

exports.capture_payment = function (req, res) {
    var params = m.getBody(req);
    request({
        method: 'POST',
        url: paymentsStr+params.payment_id+'/capture',
        form: {
            amount: params.amount
        }
    }, function (error, response, body) {
        if(error) return log(error);
        params.buyer=req.userId;
       models.Payment.create(params,function(err,data){
           res.send(200);
       });
    });
};
