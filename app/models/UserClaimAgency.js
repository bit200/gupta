var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var UserClaimAgencySchema = mongoose.Schema({
    user: {
        type: Number,
        ref: 'User'
    },
    agency: Array,
    created_at: {
        type: Date,
        default: Date.now
    }
});

UserClaimAgencySchema.plugin(autoIncrement.plugin, {
    model: 'UserClaimAgency',
    field: '_id',
    startAt: 100000
});

mongoose.model('UserClaimAgency', UserClaimAgencySchema);