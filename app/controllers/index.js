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

exports.first_initial_db = function (req, res) {
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
        var arr = ['Media Planning', 'Rural Marketing Planning', 'Product Placement', 'Market Research', 'Loyalty Consulting'];
        findCreateFilter('Marketing Planning', '', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Cinema Media Buying', 'Magazine Media Buying', 'Digital Media Buying', 'Radio Media Buying', 'Television Media Buying',
            'Outdoor Media Buying', 'Non Traditional Media Buying', 'Newspaper Media Buying', 'Database Provider', 'In-Games Media Buying', 'Mobile and App Media Buying'];
        findCreateFilter('Media Buying', '', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Print Ads', 'Videos', 'Animated Videos', 'Cinema Ads', 'Music and Audio', 'Banner Ads', 'Cartoonist',
            'Photography', 'Presentation Design', 'Infographics'];
        findCreateFilter('Creative and Ad making', '', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Public Relations Strategy', 'Press Release', 'Media Interactions', 'Press Conference', 'Byline Placement',
            'Crisis Communications', 'Blogger Outreach', 'Media Monitoring'];
        findCreateFilter('Public Relations', 'PR Services', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Startups', 'Lifestyle', 'Consumer Technology', 'B2B Technology', 'Celebrity', 'Retail and FMCG',
            'Hospitality', 'Pharmaceuticals', 'Education', 'Healthcare', 'Construction and Real Estate',
            'Banking and Finance', 'Politics', 'Industry Expertise'];
        findCreateFilter('Public Relations', 'Industry Expertise', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Print', 'Digital', 'Electronic'];
        findCreateFilter('Public Relations', '', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Digital Marketing Planning', 'Social Media Management', 'SEO', 'Digital Advertising',
            'Analytics', 'Online Reputation Management', 'Affiliate Marketing', 'Email Marketing'];
        findCreateFilter('Digital Marketing', '', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Brand Consulting', 'Brand Identity Design', 'Logo Design', 'Brochure Design', 'Merchandise Design', 'Web Design', 'Packaging Design', 'Business Cards'];
        findCreateFilter('Branding Services', '', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Exhibition Management', 'Events Management', 'Celebrity Management', 'Emcee'];
        findCreateFilter('Event Management', '', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['BTL Marketing', 'Retail POS', 'Telemarketing', 'Couponing / Sampling', 'Bulk SMS Service', 'Bulk Email Service', 'Promotional Merchandise'];
        findCreateFilter('Direct Marketing', '', arr, cb)
    });

    arrFunc.push(function (cb) {
        var arr = ['Content Writing', 'Creative and Ad Making', 'Public Relations', 'Bloggers and Influencers',
            'Digital Marketing', 'Branding Services', 'Event Management', 'Direct Marketing', 'Media Planning', 'Media Buying']

        var count = 0;
        _.forEach(arr, function (item) {
            m.findCreate(models.ServiceProvider, {name: item}, {isActive: 1}, {}, function () {
                count++;
                if (arr.length == count) {
                    cb()
                }
            })
        });
    });

    arrFunc.push(function (cb) {
        var arr = ['Mumbai', 'Delhi', 'Bangalore'];
        var count = 0;
        _.forEach(arr, function (item) {
            m.findCreate(models.Location, {name: item}, {isActive: 1}, {}, function () {
                count++;
                if (arr.length == count) {
                    cb()
                }
            })
        });
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
        m.distinct(models.UserClaimAgency, {user: req.userId}, 'agency', res, function (arr) {
            _.forEach(agency, function (item) {
                arrfunc.push(function (cb) {
                    item.status = _.flatten(arr).indexOf(item.name) > -1;
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
            m.create(models.BusinessUser, params.data, res, function (data) {
                m.create(models.UserClaimAgency, {agency: agency.name, user: req.userId}, res, m.scb(data, res))
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


