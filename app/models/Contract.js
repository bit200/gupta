var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ContractSchema = mongoose.Schema({
    title: String,
    information: String,
    buyer_name: String,
    buyer_company_name: String,
    buyer: {
        type: Number,
        ref: 'User'
    },
    seller_contact: String,
    seller_name: String,
    freelancer: {
        type: Number,
        ref: 'Freelancer'
    },
    seller: {
        type: Number,
        ref: 'User'
    },
    job: {
        type: Number,
        ref: 'Job'
    },
    payment_basis: String,
    expected_start: Date,
    expected_completion: Date,
    amount: Number,
    status: String,
    status_priority: {
        type: Number,
        default: 0
    },
    reject_reason: String,
    rating: Number,
    created_at: {
        type: Date,
        default: Date.now
    }
});

var sort_obj = {
    'Wait seller contract approvement': 0,
    'Closed': -1,
    'Ongoing': 1
}

ContractSchema.pre('save', function(next){
    this.status_priority = sort_obj[this.status] || -100
    next();
})

ContractSchema.plugin(autoIncrement.plugin, {
    model: 'Contract',
    field: '_id',
    startAt: 100000
});

mongoose.model('Contract', ContractSchema);