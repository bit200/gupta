var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var QuestionnaireSchema = mongoose.Schema({
    service_provider: String,
    question: String,
    items: [String],
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