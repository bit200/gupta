var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var AttachmentSchema = mongoose.Schema({
    originalName: String,
    name: String,
    path: String,
    created_at: {
        type: Date,
        default: Date.now
    }
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    versionKey: false
});


AttachmentSchema.plugin(autoIncrement.plugin, {
    model: 'Attachment',
    field: '_id',
    startAt: 100000
});

AttachmentSchema.virtual('url').get(function() {
    return '/uploads/'+this.path+'/'+this.name;
});

mongoose.model('Attachment', AttachmentSchema);
