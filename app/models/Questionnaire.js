var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var QuestionnaireSchema = mongoose.Schema({
    type: String,
    service_provider: String,
    question: String,
    table:Array,
    row_number: Number,
    items: [String],
    autocomplete:Boolean,
    autocomplete_type:String,
    created_at: {
        type: Date,
        default: Date.now
    }
});


QuestionnaireSchema.plugin(autoIncrement.plugin, {
    model: 'Questionnaire',
    field: '_id',
    startAt: 100000
});

mongoose.model('Questionnaire', QuestionnaireSchema);