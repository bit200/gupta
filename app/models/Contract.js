var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ContractSchema = mongoose.Schema({
    title: String,
    buyer_name: String,
    buyer_company_name: String,
    seller_contact: String,
    seller_name: String,
    payment_basis: String,
    start_date: Date,
    completion_date: Date,
    amount: Number,
    status: String,
    rating: Number,

    created_at: {
        type: Date,
        default: Date.now
    }
});


ContractSchema.plugin(autoIncrement.plugin, {
    model: 'Contract',
    field: '_id',
    startAt: 100000
});

mongoose.model('Contract', ContractSchema);