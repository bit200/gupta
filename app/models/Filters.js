var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var CommonFiltersSchema = mongoose.Schema({
    type: String,
    name: String,
    filter: String,
    isActive: Boolean,
    created_at: {
        type: Date,
        default: Date.now
    }
});


CommonFiltersSchema.plugin(autoIncrement.plugin, {
    model: 'Filters',
    field: '_id',
    startAt: 100000
});


mongoose.model('Filters', CommonFiltersSchema);
