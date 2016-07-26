var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var FavoriteSchema = mongoose.Schema({
    owner: {
        type: Number,
        ref: 'User'
    },
    freelancer: {
        type: Number,
        ref: 'Freelancer'
    },
    job: {
        type: Number,
        ref: 'Job'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


FavoriteSchema.plugin(autoIncrement.plugin, {
    model: 'FavoriteSchema',
    field: '_id',
    startAt: 100040
});

mongoose.model('Favorite', FavoriteSchema);