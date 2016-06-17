var models = require('../db')
    , config = require('../config')
    , m = require('../m');


exports.add_job = function (req, res) {
    var params = m.getBody(req);
    m.create(models.Job, params, res, res)
};

exports.add_freelancer = function (req, res) {
    var params = m.getBody(req);
    params.user = req.userId
    m.create(models.Freelancer, params, res, res)
};

exports.get_freelancer = function (req, res) {
    var params = m.getBody(req);
    m.find(models.Freelancer, params, res, res,{populate:'user'})
}

exports.add_package = function(req, res) {
    var params = m.getBody(req);
    m.create(models.Package, params, res, res)
};
