var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ContractSchema = mongoose.Schema({
    freelancer: {
        type: Number,
        ref: 'Freelancer'
    },
    buyer: {
        type: Number,
        ref: 'User'
    },
    seller: {
        type: Number,
        ref: 'User'
    },
    job: {
        type: Number,
        ref: 'Job'
    },
    suggest: {
        type: Number,
        ref: 'SuggestContract'
    }
    ,suggest_buyer: {
        type: Number,
        ref: 'SuggestContract'
    },
    suggest_seller: {
        type: Number,
        ref: 'SuggestContract'
    },
    title: String,
    information: String,
    buyer_name: String,
    buyer_company_name: String,
    seller_contact: String,
    seller_name: String,
    payment_basis: String,
    expected_start: Date,
    expected_completion: Date,
    amount: Number,
    wait_seller: Boolean,
    wait_buyer: Boolean,
    final_amount: Number,
    budget: Number,
    status_priority: {
        type: Number,
        default: 0
    },
    status: {
        type: String
    },
    reject_reason: String,
    pause_reason: String,
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
    console.log('this.status', this.status, sort_obj[this.status])
    var priority = sort_obj[this.status]
    this.status_priority = priority || priority == 0 ? priority : -100
    next();
})

ContractSchema.plugin(autoIncrement.plugin, {
    model: 'Contract',
    field: '_id',
    startAt: 100000
});

mongoose.model('Contract', ContractSchema);