var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var FreelancerSchema = mongoose.Schema({
    name: String,
    type: String,
    introduction: String,
    description: String,
    location: String,
    cities: Array,
    experience: Number,
    freelancer_type: Array,
    industry_expertise: Array,
    content_type: Array,
    languages: Array,
    service_price: Number,
    poster: {
        type: Number,
        ref: 'UploadFile'
    },
    service_packages: [{
        type: Number,
        ref: 'Package'
    }],
    Attachments: [{
        type: Number,
        ref: 'UploadFile'
    }],
    profile: String,
    number_employees: Number,
    //0 - pending, 1-approved, 2-rejected
    registrationStatus: {
        type: Number,
        default:0
    },
    rejected_reason: String,
    isActive: {
        type: Number,
        default:0
    },
    work: {
        type: Number,
        ref: 'Work'
    },
    contact_detail: {
        type: Number,
        ref: 'ContactDetail'
    },
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
        type: Number,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


FreelancerSchema.plugin(autoIncrement.plugin, {
    model: 'Freelancer',
    field: '_id',
    startAt: 100040
});

mongoose.model('Freelancer', FreelancerSchema);