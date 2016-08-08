var models = require('../db')
    , mail = require('../mail')
    , config = require('../config')
    , m = require('../m'),
    fs = require('fs'),
    _ = require('underscore'),
    async = require('async');

/// |email:|testXYZonline5@gmail.com  |pass:|testXYZonline
// razorplay/// |pass:| testXYZonline5  |ID:|5weeOmBG7zAWgM  |key_ID| rzp_test_Rwg8wDQEM22Lza |key secret| BQi4QKJXDD1E4VGilt9m4Zzu
// razorplay/// |pass:| testXYZonline5  |ID:|6499WGgcoJGvvw  |key_ID| rzp_test_Rwg8wDQEM22Lza |key secret| BQi4QKJXDD1E4VGilt9m4Zzu
///---------------------------------------------------------------------------------------------------
var request = require('request');
var key_id='rzp_test_Rwg8wDQEM22Lza';
var key_secret='BQi4QKJXDD1E4VGilt9m4Zzu';
var paymentsStr='https://'+key_id+':'+key_secret+'@api.razorpay.com/v1/payments/';
///---------------------------------------------------------------------------------------------------


exports.get_payments = function(req,res){
    models.Payment.find({}).populate([{path:'buyer'},{path:'seller'},{path:'contract'}]).exec(function(err,data){
        if(err) return console.log('Find payments err', err);
        res.send(data);
    })
};
exports.capture_payment = function (req, res) {
    var params = m.getBody(req);
    console.log('111',params);
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
           models.Contract.findOne({_id:params.contract}).populate({path:'buyer'}).exec(function(err,data){
               console.log('11213',JSON.stringify(data));
               if(data)
                   mail.initialPayment(data.buyer,data,params.amount);
           });
           res.send(200);
       });
    });
};
