var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var WorkSchema = mongoose.Schema({
    customers: Number,
    past_client: String,
    testimonials: String,
    awards: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


WorkSchema.plugin(autoIncrement.plugin, {
    model: 'Work',
    field: '_id',
    startAt: 100000
});

mongoose.model('Work', WorkSchema);