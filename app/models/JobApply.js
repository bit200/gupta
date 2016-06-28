var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var JobSchema = mongoose.Schema({
    message: String,
    freelancer: {
        type: Number,
        ref: 'Freelancer'
    },
    user: {
        type: Number,
        ref: 'User'
    },
    contract: {
        type: Number,
        ref: 'Contract'
    },
    buyer: {
        type: Number,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'New Applicant'
    },
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
var sort_obj = {
    'Wait seller contract approvement': 1000,
    'New Applicant': 1,
    'Rejected': -100,
    'Communicated': 100
}

JobSchema.pre('save', function(next){
    this.status_priority = sort_obj[this.status] || -100
    next();
})

JobSchema.plugin(autoIncrement.plugin, {
    model: 'JobApply',
    field: '_id',
    startAt: 100000
});

mongoose.model('JobApply', JobSchema);