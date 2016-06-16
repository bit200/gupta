var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var FreelancerSchema = mongoose.Schema({
    name: String,
    type: String,
    introduction: String,
    description: String,
    location: String,
    cities_service: Array,
    experience: Number,
    freelancer_type: Array,
    industry_expertise: Array,
    content_type: Array,
    languages: Array,
    service_type: String,
    serviceID: Number,
    service_price: Number,
    poster: String,

    rating: {
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    },
    popularity: {
        type: Number,
        default: 0
    },
    user: {
        type:Number,
        ref: 'User'
    },
    package: {
        type: Number,
        ref: 'Package'
    },
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