var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var BloggersAndInfluencersSchema = mongoose.Schema({
    name: String,
    filter: String,
    isActive: Boolean,
    created_at: {
        type: Date,
        default: Date.now
    }
});


BloggersAndInfluencersSchema.plugin(autoIncrement.plugin, {
    model: 'BloggersAndInfluencers',
    field: '_id',
    startAt: 100000
});

mongoose.model('BloggersAndInfluencers', BloggersAndInfluencersSchema);