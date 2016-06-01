var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var SellerSchema = mongoose.Schema({
    user: {
        type: String,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


SellerSchema.plugin(autoIncrement.plugin, {
    model: 'Seller',
    field: '_id',
    startAt: 100000
});

mongoose.model('Seller', SellerSchema);