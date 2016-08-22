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
    service_providers: Array,
    languages: Array,
    url: String,
    address: String,
    phone: String,
    employees: String,
    questionnaire: Array,
    logo: String,
    brochure: String,
    sorted: {
        type: Boolean,
        default: false
    },
    price: {
        word: Number,
        hour: Number
    },
    past_clients: [{
        type: Number,
        ref: 'PastClient'
    }],
    service_packages: [{
        type: Number,
        ref: 'Package'
    }],
    translation: Array,
    profile: String,
    number_employees: Number,
    //0 - pending, 1-approved, 2-rejected
    registrationStatus: {
        type: Number,
        default: 0
    },
    status: String,
    reject_reason: String,
    isActive: {
        type: Number,
        default: 0
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
    ratingCount: {
        type: Number,
        default: 0
    },
    popularity: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    user: {
        type: Number,
        ref: 'User'
    },
    business_account: {
        type: Number,
        ref: 'BusinessUser'
    },
    last_activity: {
        type: Date,
        default: Date.now
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