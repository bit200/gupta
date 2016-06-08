var models = require('../db')
    , config = require('../config')
    , m = require('../m')
    , _ = require('underscore')
    , fs = require('fs')
    , async = require('async')
    , path = require('path');


exports.index = function (req, res) {
    res.render('src')
};
exports.admin = function (req, res) {
    res.render('admin/admin-index')
};

exports.create_filter = function (req, res) {
    var arrFunc = [];
    arrFunc.push(function (cb) {
        var arr = ['Blogs and Articles', 'Copywriting / Web Content', 'Technical Writing', 'Press Release Writing', 'Proof Reading', 'Books and Magazines', 'Translation'];
        findCreateFilter('ContentWriting', 'Content Type', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Health and Fitness', 'Business and Finance', 'Kids and Parenting', 'Sports', 'Travel & Tourism', 'Education', 'Technology', 'Science', 'Real Estate',
            'Automotive', 'Food and Beverages', 'Media and Entertainment', 'Lifestyle'];
        findCreateFilter('ContentWriting', 'Industry Expertise', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi',
            'Urdu', 'Punjabi', 'French', 'German', 'Spanish', 'Japanese', 'Chinese'];
        findCreateFilter('ContentWriting', 'Languages', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Health and Fitness', 'Business and Finance', 'Kids and Parenting', 'Sports', 'Travel and Tourism', 'Education',
            'Technology', 'Science', 'Real Estate', 'Automotive', 'Food and Beverages', 'Lifestyle', 'Mobile and Gadgets',
            'Fashion and Beauty', 'Cooking', 'Vernacular Language', 'Books and Reading'];
        findCreateFilter('BloggersAndInfluencers', 'Industry Expertise', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Web Blog', 'Video Blog', 'Social Influencer'];
        findCreateFilter('BloggersAndInfluencers', 'Blog Type', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Mumbai', 'Delhi', 'Bangalore'];
        findCreateFilter('Location', '', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Content Marketing', 'Public Relations', 'Celebrity Management', 'Bloggers and Influencers',
            'Digital Marketing', 'Creative Design', 'Media Planning', 'Media Buying', 'Ad Making', 'Exhibition Management'];
        findCreateFilter('FreelancerType', '', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Content Marketing', 'Public Relations', 'Celebrity Management', 'Bloggers and Influencers',
            'Digital Marketing', 'Creative Design', 'Media Planning', 'Media Buying', 'Ad Making', 'Exhibition Management'];
        findCreateFilter('FreelancerType', '', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = [
            {
                logo: '',
                name: 'Content360',
                category: 'Content Writing',
                city: 'Bangalore',
                street: 'Church Street',
                number_street: 132
            },
            {
                logo: '',
                name: 'Reach PR',
                category: 'Content Writing',
                city: 'Mumbai',
                street: 'Fort',
                number_street: 33
            }
        ];
        var count = 0;
        _.forEach(arr, function (item) {
            m.findCreate(models.Agency, item, {}, {}, function () {
                count++;
                if (arr.length == count) {
                    cb()
                }
            })
        });
    });

    async.parallel(arrFunc, function (e, r) {
        m.scb('done', res)
    })
};

exports.get_content = function (req, res) {
    var params = m.getBody(req);
    m.distinct(models[params.name], JSON.parse(params.query), params.distinctName, res, res)
};


exports.get_agency = function (req, res) {
    var params = m.getBody(req);
    var arrfunc = [];
    m.find(models.Agency, {}, res, function (agency) {
        m.find(models.UserClaimAgency, {user: m.getUserIDByToken(req.token)}, res, function (arr) {
            _.forEach(agency, function (item) {
                arrfunc.push(function (cb) {
                    item.status = arr.indexOf(item.name) > -1;
                    cb()
                })
            });
            async.parallel(arrfunc, function (e, r) {
                m.scb(agency, res)
            })

        })
    })
};

exports.request_business = function (req, res) {
    var params = m.getBody(req);
    m.findOne(models.Agency, {name: params.agency}, res, function (agency) {
        params.data.agency = agency._id;
        m.findOne(models.BusinessUser, {agency: agency._id, email: params.data.email}, function (err) {
            m.create(models.BusinessUser, params.data, res, function(data){
                m.create(models.UserClaimAgency, {agency: agency._id, user: m.getUserIDByToken(req.token)}, res, m.scb(data,res))
                });
        }, function () {
            m.scb('find', res)
        })
    })
};

function findCreateFilter(name, filter, arr, cb) {
    var count = 0;
    _.forEach(arr, function (item) {
        m.findCreate(models.Filters, {name: item}, {type: name, filter: filter, isActive: true}, {}, function () {
            count++;
            if (arr.length == count) {
                cb()
            }
        })
    });
}


