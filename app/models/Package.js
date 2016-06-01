var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var PackageSchema = mongoose.Schema({
    title: String,
    description: String,
    pricing: Number,
    extras: Array,
    information: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

PackageSchema.plugin(autoIncrement.plugin, {
    model: 'Package',
    field: '_id',
    startAt: 100000
});

mongoose.model('Package', PackageSchema);