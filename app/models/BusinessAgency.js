var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var BusinessAgencySchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    role: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

BusinessAgencySchema.plugin(autoIncrement.plugin, {
    model: 'BusinessAgency',
    field: '_id',
    startAt: 100000
});

mongoose.model('BusinessAgency', BusinessAgencySchema);