var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var PackageSchema = mongoose.Schema({
    title: String,
    description: String,
    pricing: Number,
    extras: Array,
    information: String,
    preview: String,
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

PackageSchema.virtual('preview_url').get(function() {
    return this.preview ? '/uploads/packages/'+this._id+'/'+this.preview : '';
});
mongoose.model('Package', PackageSchema);