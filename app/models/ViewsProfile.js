var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var ViewsProfileSchema = mongoose.Schema({
    freelancer: {
        type: Number,
        ref: 'Freelancer'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


ViewsProfileSchema.plugin(autoIncrement.plugin, {
    model: 'ViewsProfileSchema',
    field: '_id',
    startAt: 100040
});

mongoose.model('ViewsProfile', ViewsProfileSchema);