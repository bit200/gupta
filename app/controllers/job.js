var models = require('../db')
    , config = require('../config')
    , m = require('../m');


exports.add_job = function (req, res) {
    var params = m.getBody(req);
    m.create(models.Job, params, res, res)
};