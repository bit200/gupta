var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ServiceProviderSchema = mongoose.Schema({
    name: String,
    isActive: Boolean,
    sub_categories: Array,
    created_at: {
        type: Date,
        default: Date.now
    }
});


ServiceProviderSchema.plugin(autoIncrement.plugin, {
    model: 'ServiceProvider',
    field: '_id',
    startAt: 100000
});


mongoose.model('ServiceProvider', ServiceProviderSchema);