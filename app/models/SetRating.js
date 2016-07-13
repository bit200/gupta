var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var SetRatingSchema = mongoose.Schema({
    seller_communication: Number,
    service_and_described: Number,
    would_recommend: Number,
    contract: {
        type: Number,
        ref: 'Contract'
    },
    buyer: {
        type: Number,
        ref: 'User'
    },
    freelancer: {
        type: Number,
        ref: 'Freelancer'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


SetRatingSchema.plugin(autoIncrement.plugin, {
    model: 'SetRating',
    field: '_id',
    startAt: 100000
});

mongoose.model('SetRating', SetRatingSchema);