var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var MasterDataSchema = mongoose.Schema({
    name: String,
    nameType: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


MasterDataSchema.plugin(autoIncrement.plugin, {
    model: 'MasterData',
    field: '_id',
    startAt: 100000
});

mongoose.model('MasterData', MasterDataSchema);
