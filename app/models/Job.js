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
    type_category: String,
    type_filter: String,
    type_name: String,
    email: String,
    client_name: String,
    company_name: String,
    website: String,
    job_visibility: Boolean,
    date_of_completion: Date,
    status: String,
    statusRating: Number,
    /*
    * 0 - Pending Approval
    * 1 - No Applicants
    * 2 - Service Providers have applied
    * 3 - Contract started
    * 4 - Rejected by seller
    * 5 - Rejected by buyer
    * 6 - Ongoing
    * 7 - Marked as completed
    * 8 - Paused
    * 9 - Closed
    * 10 - Deleted
    * */
    closed_date: Date,
    attach: [{
        type: Number,
        ref: 'Attachment'
    }],
    preview: {
        type: Number,
        ref: 'Attachment'
    },
    payment_basis: String,
    admin_approved: {
        type: Number,
        default: 0
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
    },
    questionnaries: [{question: String, answer: String, answer_items: {}}]
});

JobSchema.plugin(autoIncrement.plugin, {
    model: 'Job',
    field: '_id',
    startAt: 100000
});


JobSchema.pre('save', function(next){
    var statusArr = ['Pending Approval', 'No Applicants', 'Service Providers have applied', "Contract started", "Rejected by seller", "Rejected by buyer", "Ongoing", "Marked as completed", "Paused", "Closed", 'Deleted'];
    this.statusRating = statusArr.indexOf(this.status);
    next()
});

mongoose.model('Job', JobSchema);