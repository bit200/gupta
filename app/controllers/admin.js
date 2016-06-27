var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , mail = require('../mail')
    , _ = require('lodash')
    , jwt = require('jsonwebtoken')
    , Admin = models.Admin
    , mkdirp = require('mkdirp');
var randomstring = require("randomstring");

function createToken(admin) {
    return jwt.sign(_.omit(admin, 'password'), config.adminJWTSecret, { expiresInMinutes: 60*5 });
}
exports.login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send("You must send the username and the password");
    }

    var params = m.getBody(req);
    m.findOne(Admin, {email: params.email}, res, function (admin) {
        if (!admin) {
            return res.status(401).send("The username or password don't match");
        }

        if (!admin.password === req.body.password) {
            return res.status(401).send("The username or password don't match");
        }

        res.status(201).send({
            id_token: createToken(admin)
        });
    });
};

exports.get_sellers = function (req, res) {
    var q = {};
    if (req.query.registrationStatus) q.registrationStatus = parseInt(req.query.registrationStatus);
    models.Freelancer.find(q).select('type name location').lean().exec(function(err, freelancers){
        res.json(freelancers)
    })
};
exports.get_seller = function (req, res) {
    models.Freelancer.findOne({_id: req.params.id}).populate('poster Attachments work contact_detail service_packages user').exec(function(err, freelancer){
        res.json(freelancer)
    })
};
exports.approve_registration = function (req, res) {
    var password = randomstring.generate(7)
    models.Freelancer.findOne({_id: req.params.id}).populate('contact_detail').exec(function(err, freelancer){
        m.create(models.User, {username: freelancer.contact_detail.email, password: password},res,function( user){
            freelancer.user = user
            freelancer.registrationStatus = 1;
            freelancer.save(function(){
                mail.approveAgencyRegistration({
                    freelancer: freelancer,
                    username: user.username,
                    password: user.password
                }, freelancer.name);
                res.send(200)
            })
        });
    });
};

exports.reject_registration = function (req, res) {
    m.findUpdate(models.Freelancer, {_id: req.params.id}, {registrationStatus: 2}, res, function(freelancer){
        mail.rejectAgencyRegistration({
            freelancer: freelancer
        }, freelancer.name);
        res.send(200)
    }, {populate: 'contact_detail'});

};