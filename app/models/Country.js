var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var CountrySchema = mongoose.Schema({
    name: String,
    isActive: Boolean,
    created_at: {
        type: Date,
        default: Date.now
    }
});


CountrySchema.plugin(autoIncrement.plugin, {
    model: 'Country',
    field: '_id',
    startAt: 100000
});

mongoose.model('Country', CountrySchema);