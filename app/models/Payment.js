var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');
var _ = require('underscore');

var PaymentSchema = mongoose.Schema({
    buyer:{
        type:Number,
        ref:'User'
    },
    seller:{
        type:Number,
        ref:'User'
    },
    payment_id:{
        type:String
    },
    amount:{
        type:Number
    },
    for_pkg:{
        type:Array
    },
    contract:{
        type:Number,
        ref:'Contract'

    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

PaymentSchema.plugin(autoIncrement.plugin, {
    model: 'Payment',
    field: '_id',
    startAt: 100000
});

mongoose.model('Payment', PaymentSchema);