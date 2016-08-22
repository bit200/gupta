var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var _ = require('underscore');

var PastClientSchema = mongoose.Schema({
    name: String,
    attachment: {
        type: Number,
        ref: 'Attachment'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
    versionKey: false
});

PastClientSchema.plugin(autoIncrement.plugin, {
    model: 'PastClient',
    field: '_id',
    startAt: 100000
});

PastClientSchema.pre('remove', function (next) {
    var self = this;
    require('../db').Attachment.findOne({_id: self.attachment}).exec(function (err, attch) {
        attch.remove()
    });
    require('../db').Freelancer.findOne({past_clients: {$in: [self._id]}}).exec(function (err, freelancer) {
        if (err) {
            next();
        } else {
            if (freelancer) {
                freelancer.past_clients.splice(freelancer.past_clients.indexOf(self._id), 1)
                freelancer.save()
            }
        }
    });

    next();
});

mongoose.model('PastClient', PastClientSchema);
