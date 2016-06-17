var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var JobSchema = mongoose.Schema({
    title: String,
    type: String,
    description: String,
    local_preference: Array,
    content_types: Array,
    budget: Number,
    name: String,
    mobile: String,
    email: String,
    company_name: String,
    website: String,
    job_visibility: Boolean,
    date_of_completion: Date,
    admin_approved: {
        type: Number,
        default:0
    },
    user: {
        type: Number,
        ref: 'User'
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