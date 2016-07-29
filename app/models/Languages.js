var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var LanguagesSchema = mongoose.Schema({
    name: String,
    isActive: Boolean,
    created_at: {
        type: Date,
        default: Date.now
    }
});


LanguagesSchema.plugin(autoIncrement.plugin, {
    model: 'Languages',
    field: '_id',
    startAt: 100000
});


mongoose.model('Languages', LanguagesSchema);
