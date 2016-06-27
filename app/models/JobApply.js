var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var JobSchema = mongoose.Schema({
    description: String,
    seller: {
        type: Number,
        ref: 'Freelancer'
    },
    status: {
        text: String,
        priority: {
            type: Number,
            default: 0 //Rejected priority is -1
        }
    },
    job_status: String,
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
    model: 'Job',
    field: '_id',
    startAt: 100000
});

mongoose.model('Job', JobSchema);