var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var FreelancerSchema = mongoose.Schema({
    name: String,
    freelancer_type: Array,
    industry_expertise: Array,
    location: String,
    cities_service: Array,
    experience: Number,
    content_type: Array,
    languages: Array,
    introduction: String,
    description: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


FreelancerSchema.plugin(autoIncrement.plugin, {
    model: 'Freelancer',
    field: '_id',
    startAt: 100000
});

mongoose.model('Freelancer', FreelancerSchema);