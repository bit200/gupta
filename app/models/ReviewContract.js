var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ReviewContractSchema = mongoose.Schema({
    seller_communication: Number,
    service_and_described: Number,
    would_recommend: Number,
    messages: Array,
    contract: {
        type: Number,
        ref: 'Contract'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


ReviewContractSchema.plugin(autoIncrement.plugin, {
    model: 'ReviewContract',
    field: '_id',
    startAt: 100000
});

mongoose.model('ReviewContract', ReviewContractSchema);