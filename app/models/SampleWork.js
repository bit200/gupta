var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var _ = require('underscore');

var SampleWorkSchema = mongoose.Schema({
    title: String,
    description: String,
    url: String,
    attachments: [{
        type: Number,
        ref: 'Attachment'
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    versionKey: false
});

SampleWorkSchema.plugin(autoIncrement.plugin, {
    model: 'SampleWork',
    field: '_id',
    startAt: 100000
});

SampleWorkSchema.pre('remove', function(next) {
    var self = this;
    require('../db').Attachment.find({_id: {$in: self.attachments}}).exec(function(err, attchs){
        _.each(attchs, function(attch){
            attch.remove()
        });
    });
    require('../db').Work.findOne({work_samples: {$in: [self._id]}}).exec(function(err, work){
        if (work){
            work.work_samples.splice(work.work_samples.indexOf(self._id),1)
            work.save()
        }
    });

    next();
});

mongoose.model('SampleWork', SampleWorkSchema);
