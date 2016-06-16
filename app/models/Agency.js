var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var AgencySchema = mongoose.Schema({
    logo: String,
    name: String,
    category: String,
    city: String,
    street: String,
    number_street: String,
    status: Boolean,
    rating: Number,
    created_at: {
        type: Date,
        default: Date.now
    }
});

AgencySchema.plugin(autoIncrement.plugin, {
    model: 'Agency',
    field: '_id',
    startAt: 100000
});

mongoose.model('Agency', AgencySchema);