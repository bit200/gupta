var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var JobSchema = mongoose.Schema({
    title: String,
    types: [String],
    description: String,
    local_preference: Array,
    content_types: Array,
    budget: Number,
    mobile: String,
    email: String,
    client_name: String,
    company_name: String,
    website: String,
    job_visibility: Boolean,
    date_of_completion: Date,
    status: String,
    closed_date: Date,
    admin_approved: {
        type: Number,
        default:0
    },
    reject_reason: String,
    user: {
        type: Number,
        ref: 'User'
    },
    buyer: {
        type: Number,
        ref: 'User'
    },
    contract: {
        type: Number,
        ref: 'Contract'
    },
    contracts: [{
        type: Number,
        ref: 'Contract'
    }],
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