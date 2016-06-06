var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var FreelancerTypeSchema = mongoose.Schema({
    name: String,
    filter: String,
    isActive: Boolean,
    created_at: {
        type: Date,
        default: Date.now
    }
});


FreelancerTypeSchema.plugin(autoIncrement.plugin, {
    model: 'FreelancerType',
    field: '_id',
    startAt: 100000
});

mongoose.model('FreelancerType', FreelancerTypeSchema);