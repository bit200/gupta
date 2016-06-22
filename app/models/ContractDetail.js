var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ContractDetailSchema = mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


ContractDetailSchema.plugin(autoIncrement.plugin, {
    model: 'ContractDetail',
    field: '_id',
    startAt: 100000
});

mongoose.model('ContractDetail', ContractDetailSchema);