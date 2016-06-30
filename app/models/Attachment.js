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

var deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

AttachmentSchema.pre('remove', function(next) {
    deleteFolderRecursive('/public/uploads/'+this.path+'/'+this.name)
    next();
});

mongoose.model('Attachment', AttachmentSchema);
