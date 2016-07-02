var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var SuggestContractSchema = mongoose.Schema({
    payment_basis: String,
    expected_start: Date,
    expected_completion: Date,
    final_amount: Number,
    buyer_name: String,
    buyer_company_name: String,
    seller_contact: String,
    seller_name: String,
    contract: {
        type: Number,
        ref: 'Contract'
    },
    from: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


SuggestContractSchema.plugin(autoIncrement.plugin, {
    model: 'SuggestContract',
    field: '_id',
    startAt: 100000
});

mongoose.model('SuggestContract', SuggestContractSchema);