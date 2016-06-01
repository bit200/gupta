var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var JobSchema = mongoose.Schema({
    title: String,
    type: String,
    description: String,
    local_preference: String,
    type_preference: String,
    budget: Number,
    name: String,
    mobile: Number,
    email: String,
    company_name: String,
    website: String,
    job_visibility: Boolean,
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