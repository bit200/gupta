var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');
var _ = require('underscore');

var PackageSchema = mongoose.Schema({
    title: String,
    description: String,
    pricing: Number,
    extras: Array,
    information: String,
    references_and_citations: Boolean,
    topic_research: Boolean,
    delivery_time: {
        type: Number,
        default: 1
    },
    preview: {
        type: Number,
        ref: 'Attachment'
    },
    created_at: {
        type: Date,
        default: Date.now
    }

},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    versionKey: false
});

PackageSchema.plugin(autoIncrement.plugin, {
    model: 'Package',
    field: '_id',
    startAt: 100000
});

PackageSchema.pre('remove', function(next) {
    var models = require('../db')
    models.Attachment.remove({_id: this.preview}).exec();
    next();
});
mongoose.model('Package', PackageSchema);