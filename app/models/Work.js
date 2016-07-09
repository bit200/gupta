var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var _ = require('underscore');

var WorkSchema = mongoose.Schema({
    customers: Number,
    past_client: String,
    awards: String,
    work_samples: [{
        type: Number,
        ref: 'SampleWork'
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    versionKey: false
});

WorkSchema.plugin(autoIncrement.plugin, {
    model: 'Work',
    field: '_id',
    startAt: 100000
});

mongoose.model('Work', WorkSchema);