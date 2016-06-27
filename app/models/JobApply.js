var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var JobSchema = mongoose.Schema({
    description: String,
    seller: {
        type: Number,
        ref: 'Freelancer'
    },
    status: String,
    status_priority: {
        type: Number,
        default: 0
    },
    job_status: String,
    communication_status: String,
    job: {
        type: Number,
        ref: 'Job'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

JobSchema.plugin(autoIncrement.plugin, {
    model: 'JobApply',
    field: '_id',
    startAt: 100000
});

mongoose.model('JobApply', JobSchema);