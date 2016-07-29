var config = require('../app/config'),
    m = require(config.root + 'app/m'),
    models = require(config.root + 'app/db'),
    md5 = require('md5'),
    _ = require('underscore'),
    Job = models.Job,
    Location = models.Location,
    async = require('async');


function findCreateFilter(name, filter, arr, cb) {
    var count = 0;
    _.forEach(arr, function (item) {
        m.findCreate(models.Filters, {filter: item}, {type: name, name:'', isActive: true}, {}, function () {
            count++;
            if (arr.length == count) {
                cb()
            }
        })
    });
}

module.exports = function (done) {
    Location.count().exec(function (err, count) {

        if (count) return done();
        console.log('.....Creating filters.....');
        var arrFunc = [];
        arrFunc.push(function (cb) {
            m.create(models.Admin, {
                email: 'a@igenero.com',
                password: 'Test1234'
            }, cb, cb, {publish: true})
        });

        arrFunc.push(function (cb) {
            var arr = ['Content Writing', 'Translation'];
            findCreateFilter('Content and Translation', arr, cb)
        });


        arrFunc.push(function (cb) {
            var arr = ['Events Management', 'Exhibition Management', 'Celebrity Management', 'Emceee'];
            findCreateFilter('Events and Exhibitions', '', arr, cb);
        });

        arrFunc.push(function (cb) {
            var arr = ['BTL Marketing', 'Retail POS', 'Telemarketing', 'Couponing/ Sampling', 'Bulk SMS Service', 'Bulk Email Service', 'Promotional Merchandise'];
            findCreateFilter('Direct Marketing', '', arr, cb);
        });

        arrFunc.push(function (cb) {
            var arr = ['Print Ads', 'Videos', 'Animated Videos', 'Cinema Ads', 'Radio Ads', 'Voiceover', 'Banner Ads', 'Cartoonist', 'Photography', 'Presentation Design', 'Infographics'];
            findCreateFilter('Creative and Ad Making', '', arr, cb);
        });

        arrFunc.push(function (cb) {
            var arr = ['Marketing Planning', 'Media Planning', 'Rural Marketing Planning', 'Product Placement', 'Market Research', 'Loyalty Consulting'];
            findCreateFilter('Marketing Advisor', '', arr, cb);
        });


        arrFunc.push(function (cb) {
            m.findCreate(models.Filters, {type: 'Bloggers and Influencers'}, {isActive: true}, {}, cb)
        });

        arrFunc.push(function (cb) {
            m.findCreate(models.Filters, {type: 'Public Relations'}, {isActive: true}, {}, cb)
        });

        arrFunc.push(function (cb) {
            m.findCreate(models.Filters, {type: 'Media Buying'}, {isActive: true}, {}, cb)
        });

        arrFunc.push(function (cb) {
            m.findCreate(models.Filters, {type: 'Digital Marketing'}, {isActive: true}, {}, cb)
        });

        arrFunc.push(function (cb) {
            m.findCreate(models.Filters, {type: 'Branding Services'}, {isActive: true}, {}, cb)
        });
        arrFunc.push(function (cb) {
            var arr = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Urdu', 'Punjabi', 'French', 'German', 'Spanish', 'Japanese', 'Chinese'];
            _.forEach(arr, function (item) {
                m.findCreate(models.Languages, {name: item}, {isActive: true}, {}, function () {
                    count++;
                    if (arr.length == count) {
                        cb()
                    }
                })
            })
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
            var arr = ['Content and Translation', 'Creative and Ad Making', 'Public Relations', 'Bloggers and Influencers',
                'Digital Marketing', 'Branding Services', 'Events and Exhibitions', 'Direct Marketing', 'Marketing Advisor', 'Media Buying'];
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

        async.parallel(arrFunc, function () {
            console.log('Filters created');
            done()
        })

    });
};


var obj = {
    "Events and Exhibitions": [{
        "subFilter": "Events and Exhibitions",
        "arr": [{"_id": 100538, "filter": "Emceee", "type": "Events and Exhibitions", "isActive": true, "created_at": "2016-07-29T08:05:47.664Z", "__v": 0}, {
            "_id": 100534,
            "filter": "Exhibition Management",
            "type": "Events and Exhibitions",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.662Z",
            "__v": 0
        }, {"_id": 100535, "filter": "Events Management", "type": "Events and Exhibitions", "isActive": true, "created_at": "2016-07-29T08:05:47.663Z", "__v": 0}, {
            "_id": 100537,
            "filter": "Celebrity Management",
            "type": "Events and Exhibitions",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.663Z",
            "__v": 0
        }]
    }, {
        "subFilter": "Events and Exhibitions",
        "arr": [{"_id": 100538, "filter": "Emceee", "type": "Events and Exhibitions", "isActive": true, "created_at": "2016-07-29T08:05:47.664Z", "__v": 0}, {
            "_id": 100534,
            "filter": "Exhibition Management",
            "type": "Events and Exhibitions",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.662Z",
            "__v": 0
        }, {"_id": 100535, "filter": "Events Management", "type": "Events and Exhibitions", "isActive": true, "created_at": "2016-07-29T08:05:47.663Z", "__v": 0}, {
            "_id": 100537,
            "filter": "Celebrity Management",
            "type": "Events and Exhibitions",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.663Z",
            "__v": 0
        }]
    }, {
        "subFilter": "Events and Exhibitions",
        "arr": [{"_id": 100538, "filter": "Emceee", "type": "Events and Exhibitions", "isActive": true, "created_at": "2016-07-29T08:05:47.664Z", "__v": 0}, {
            "_id": 100534,
            "filter": "Exhibition Management",
            "type": "Events and Exhibitions",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.662Z",
            "__v": 0
        }, {"_id": 100535, "filter": "Events Management", "type": "Events and Exhibitions", "isActive": true, "created_at": "2016-07-29T08:05:47.663Z", "__v": 0}, {
            "_id": 100537,
            "filter": "Celebrity Management",
            "type": "Events and Exhibitions",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.663Z",
            "__v": 0
        }]
    }, {
        "subFilter": "Events and Exhibitions",
        "arr": [{"_id": 100538, "filter": "Emceee", "type": "Events and Exhibitions", "isActive": true, "created_at": "2016-07-29T08:05:47.664Z", "__v": 0}, {
            "_id": 100534,
            "filter": "Exhibition Management",
            "type": "Events and Exhibitions",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.662Z",
            "__v": 0
        }, {"_id": 100535, "filter": "Events Management", "type": "Events and Exhibitions", "isActive": true, "created_at": "2016-07-29T08:05:47.663Z", "__v": 0}, {
            "_id": 100537,
            "filter": "Celebrity Management",
            "type": "Events and Exhibitions",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.663Z",
            "__v": 0
        }]
    }],
    "Direct Marketing": [{
        "subFilter": "Direct Marketing",
        "arr": [{"_id": 100536, "filter": "BTL Marketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.663Z", "__v": 0}, {
            "_id": 100539,
            "filter": "Retail POS",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.664Z",
            "__v": 0
        }, {"_id": 100540, "filter": "Telemarketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.668Z", "__v": 0}, {
            "_id": 100541,
            "filter": "Couponing/ Sampling",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.681Z",
            "__v": 0
        }, {"_id": 100542, "filter": "Bulk SMS Service", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.760Z", "__v": 0}, {
            "_id": 100543,
            "filter": "Bulk Email Service",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.762Z",
            "__v": 0
        }, {"_id": 100544, "filter": "Promotional Merchandise", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.764Z", "__v": 0}]
    }, {
        "subFilter": "Direct Marketing",
        "arr": [{"_id": 100536, "filter": "BTL Marketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.663Z", "__v": 0}, {
            "_id": 100539,
            "filter": "Retail POS",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.664Z",
            "__v": 0
        }, {"_id": 100540, "filter": "Telemarketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.668Z", "__v": 0}, {
            "_id": 100541,
            "filter": "Couponing/ Sampling",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.681Z",
            "__v": 0
        }, {"_id": 100542, "filter": "Bulk SMS Service", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.760Z", "__v": 0}, {
            "_id": 100543,
            "filter": "Bulk Email Service",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.762Z",
            "__v": 0
        }, {"_id": 100544, "filter": "Promotional Merchandise", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.764Z", "__v": 0}]
    }, {
        "subFilter": "Direct Marketing",
        "arr": [{"_id": 100536, "filter": "BTL Marketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.663Z", "__v": 0}, {
            "_id": 100539,
            "filter": "Retail POS",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.664Z",
            "__v": 0
        }, {"_id": 100540, "filter": "Telemarketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.668Z", "__v": 0}, {
            "_id": 100541,
            "filter": "Couponing/ Sampling",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.681Z",
            "__v": 0
        }, {"_id": 100542, "filter": "Bulk SMS Service", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.760Z", "__v": 0}, {
            "_id": 100543,
            "filter": "Bulk Email Service",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.762Z",
            "__v": 0
        }, {"_id": 100544, "filter": "Promotional Merchandise", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.764Z", "__v": 0}]
    }, {
        "subFilter": "Direct Marketing",
        "arr": [{"_id": 100536, "filter": "BTL Marketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.663Z", "__v": 0}, {
            "_id": 100539,
            "filter": "Retail POS",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.664Z",
            "__v": 0
        }, {"_id": 100540, "filter": "Telemarketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.668Z", "__v": 0}, {
            "_id": 100541,
            "filter": "Couponing/ Sampling",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.681Z",
            "__v": 0
        }, {"_id": 100542, "filter": "Bulk SMS Service", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.760Z", "__v": 0}, {
            "_id": 100543,
            "filter": "Bulk Email Service",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.762Z",
            "__v": 0
        }, {"_id": 100544, "filter": "Promotional Merchandise", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.764Z", "__v": 0}]
    }, {
        "subFilter": "Direct Marketing",
        "arr": [{"_id": 100536, "filter": "BTL Marketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.663Z", "__v": 0}, {
            "_id": 100539,
            "filter": "Retail POS",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.664Z",
            "__v": 0
        }, {"_id": 100540, "filter": "Telemarketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.668Z", "__v": 0}, {
            "_id": 100541,
            "filter": "Couponing/ Sampling",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.681Z",
            "__v": 0
        }, {"_id": 100542, "filter": "Bulk SMS Service", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.760Z", "__v": 0}, {
            "_id": 100543,
            "filter": "Bulk Email Service",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.762Z",
            "__v": 0
        }, {"_id": 100544, "filter": "Promotional Merchandise", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.764Z", "__v": 0}]
    }, {
        "subFilter": "Direct Marketing",
        "arr": [{"_id": 100536, "filter": "BTL Marketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.663Z", "__v": 0}, {
            "_id": 100539,
            "filter": "Retail POS",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.664Z",
            "__v": 0
        }, {"_id": 100540, "filter": "Telemarketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.668Z", "__v": 0}, {
            "_id": 100541,
            "filter": "Couponing/ Sampling",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.681Z",
            "__v": 0
        }, {"_id": 100542, "filter": "Bulk SMS Service", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.760Z", "__v": 0}, {
            "_id": 100543,
            "filter": "Bulk Email Service",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.762Z",
            "__v": 0
        }, {"_id": 100544, "filter": "Promotional Merchandise", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.764Z", "__v": 0}]
    }, {
        "subFilter": "Direct Marketing",
        "arr": [{"_id": 100536, "filter": "BTL Marketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.663Z", "__v": 0}, {
            "_id": 100539,
            "filter": "Retail POS",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.664Z",
            "__v": 0
        }, {"_id": 100540, "filter": "Telemarketing", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.668Z", "__v": 0}, {
            "_id": 100541,
            "filter": "Couponing/ Sampling",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.681Z",
            "__v": 0
        }, {"_id": 100542, "filter": "Bulk SMS Service", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.760Z", "__v": 0}, {
            "_id": 100543,
            "filter": "Bulk Email Service",
            "type": "Direct Marketing",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.762Z",
            "__v": 0
        }, {"_id": 100544, "filter": "Promotional Merchandise", "type": "Direct Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.764Z", "__v": 0}]
    }],
    "Creative and Ad Making": [{
        "subFilter": "Creative and Ad Making",
        "arr": [{"_id": 100545, "filter": "Print Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.766Z", "__v": 0}, {
            "_id": 100546,
            "filter": "Videos",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.769Z",
            "__v": 0
        }, {"_id": 100547, "filter": "Animated Videos", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.772Z", "__v": 0}, {
            "_id": 100548,
            "filter": "Cinema Ads",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.773Z",
            "__v": 0
        }, {"_id": 100549, "filter": "Radio Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.775Z", "__v": 0}, {
            "_id": 100550,
            "filter": "Voiceover",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.777Z",
            "__v": 0
        }, {"_id": 100551, "filter": "Banner Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.779Z", "__v": 0}, {
            "_id": 100552,
            "filter": "Cartoonist",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.782Z",
            "__v": 0
        }, {"_id": 100553, "filter": "Photography", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.784Z", "__v": 0}, {
            "_id": 100554,
            "filter": "Presentation Design",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.787Z",
            "__v": 0
        }, {"_id": 100555, "filter": "Infographics", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.788Z", "__v": 0}]
    }, {
        "subFilter": "Creative and Ad Making",
        "arr": [{"_id": 100545, "filter": "Print Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.766Z", "__v": 0}, {
            "_id": 100546,
            "filter": "Videos",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.769Z",
            "__v": 0
        }, {"_id": 100547, "filter": "Animated Videos", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.772Z", "__v": 0}, {
            "_id": 100548,
            "filter": "Cinema Ads",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.773Z",
            "__v": 0
        }, {"_id": 100549, "filter": "Radio Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.775Z", "__v": 0}, {
            "_id": 100550,
            "filter": "Voiceover",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.777Z",
            "__v": 0
        }, {"_id": 100551, "filter": "Banner Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.779Z", "__v": 0}, {
            "_id": 100552,
            "filter": "Cartoonist",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.782Z",
            "__v": 0
        }, {"_id": 100553, "filter": "Photography", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.784Z", "__v": 0}, {
            "_id": 100554,
            "filter": "Presentation Design",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.787Z",
            "__v": 0
        }, {"_id": 100555, "filter": "Infographics", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.788Z", "__v": 0}]
    }, {
        "subFilter": "Creative and Ad Making",
        "arr": [{"_id": 100545, "filter": "Print Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.766Z", "__v": 0}, {
            "_id": 100546,
            "filter": "Videos",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.769Z",
            "__v": 0
        }, {"_id": 100547, "filter": "Animated Videos", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.772Z", "__v": 0}, {
            "_id": 100548,
            "filter": "Cinema Ads",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.773Z",
            "__v": 0
        }, {"_id": 100549, "filter": "Radio Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.775Z", "__v": 0}, {
            "_id": 100550,
            "filter": "Voiceover",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.777Z",
            "__v": 0
        }, {"_id": 100551, "filter": "Banner Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.779Z", "__v": 0}, {
            "_id": 100552,
            "filter": "Cartoonist",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.782Z",
            "__v": 0
        }, {"_id": 100553, "filter": "Photography", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.784Z", "__v": 0}, {
            "_id": 100554,
            "filter": "Presentation Design",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.787Z",
            "__v": 0
        }, {"_id": 100555, "filter": "Infographics", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.788Z", "__v": 0}]
    }, {
        "subFilter": "Creative and Ad Making",
        "arr": [{"_id": 100545, "filter": "Print Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.766Z", "__v": 0}, {
            "_id": 100546,
            "filter": "Videos",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.769Z",
            "__v": 0
        }, {"_id": 100547, "filter": "Animated Videos", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.772Z", "__v": 0}, {
            "_id": 100548,
            "filter": "Cinema Ads",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.773Z",
            "__v": 0
        }, {"_id": 100549, "filter": "Radio Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.775Z", "__v": 0}, {
            "_id": 100550,
            "filter": "Voiceover",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.777Z",
            "__v": 0
        }, {"_id": 100551, "filter": "Banner Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.779Z", "__v": 0}, {
            "_id": 100552,
            "filter": "Cartoonist",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.782Z",
            "__v": 0
        }, {"_id": 100553, "filter": "Photography", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.784Z", "__v": 0}, {
            "_id": 100554,
            "filter": "Presentation Design",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.787Z",
            "__v": 0
        }, {"_id": 100555, "filter": "Infographics", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.788Z", "__v": 0}]
    }, {
        "subFilter": "Creative and Ad Making",
        "arr": [{"_id": 100545, "filter": "Print Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.766Z", "__v": 0}, {
            "_id": 100546,
            "filter": "Videos",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.769Z",
            "__v": 0
        }, {"_id": 100547, "filter": "Animated Videos", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.772Z", "__v": 0}, {
            "_id": 100548,
            "filter": "Cinema Ads",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.773Z",
            "__v": 0
        }, {"_id": 100549, "filter": "Radio Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.775Z", "__v": 0}, {
            "_id": 100550,
            "filter": "Voiceover",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.777Z",
            "__v": 0
        }, {"_id": 100551, "filter": "Banner Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.779Z", "__v": 0}, {
            "_id": 100552,
            "filter": "Cartoonist",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.782Z",
            "__v": 0
        }, {"_id": 100553, "filter": "Photography", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.784Z", "__v": 0}, {
            "_id": 100554,
            "filter": "Presentation Design",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.787Z",
            "__v": 0
        }, {"_id": 100555, "filter": "Infographics", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.788Z", "__v": 0}]
    }, {
        "subFilter": "Creative and Ad Making",
        "arr": [{"_id": 100545, "filter": "Print Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.766Z", "__v": 0}, {
            "_id": 100546,
            "filter": "Videos",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.769Z",
            "__v": 0
        }, {"_id": 100547, "filter": "Animated Videos", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.772Z", "__v": 0}, {
            "_id": 100548,
            "filter": "Cinema Ads",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.773Z",
            "__v": 0
        }, {"_id": 100549, "filter": "Radio Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.775Z", "__v": 0}, {
            "_id": 100550,
            "filter": "Voiceover",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.777Z",
            "__v": 0
        }, {"_id": 100551, "filter": "Banner Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.779Z", "__v": 0}, {
            "_id": 100552,
            "filter": "Cartoonist",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.782Z",
            "__v": 0
        }, {"_id": 100553, "filter": "Photography", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.784Z", "__v": 0}, {
            "_id": 100554,
            "filter": "Presentation Design",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.787Z",
            "__v": 0
        }, {"_id": 100555, "filter": "Infographics", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.788Z", "__v": 0}]
    }, {
        "subFilter": "Creative and Ad Making",
        "arr": [{"_id": 100545, "filter": "Print Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.766Z", "__v": 0}, {
            "_id": 100546,
            "filter": "Videos",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.769Z",
            "__v": 0
        }, {"_id": 100547, "filter": "Animated Videos", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.772Z", "__v": 0}, {
            "_id": 100548,
            "filter": "Cinema Ads",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.773Z",
            "__v": 0
        }, {"_id": 100549, "filter": "Radio Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.775Z", "__v": 0}, {
            "_id": 100550,
            "filter": "Voiceover",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.777Z",
            "__v": 0
        }, {"_id": 100551, "filter": "Banner Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.779Z", "__v": 0}, {
            "_id": 100552,
            "filter": "Cartoonist",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.782Z",
            "__v": 0
        }, {"_id": 100553, "filter": "Photography", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.784Z", "__v": 0}, {
            "_id": 100554,
            "filter": "Presentation Design",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.787Z",
            "__v": 0
        }, {"_id": 100555, "filter": "Infographics", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.788Z", "__v": 0}]
    }, {
        "subFilter": "Creative and Ad Making",
        "arr": [{"_id": 100545, "filter": "Print Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.766Z", "__v": 0}, {
            "_id": 100546,
            "filter": "Videos",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.769Z",
            "__v": 0
        }, {"_id": 100547, "filter": "Animated Videos", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.772Z", "__v": 0}, {
            "_id": 100548,
            "filter": "Cinema Ads",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.773Z",
            "__v": 0
        }, {"_id": 100549, "filter": "Radio Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.775Z", "__v": 0}, {
            "_id": 100550,
            "filter": "Voiceover",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.777Z",
            "__v": 0
        }, {"_id": 100551, "filter": "Banner Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.779Z", "__v": 0}, {
            "_id": 100552,
            "filter": "Cartoonist",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.782Z",
            "__v": 0
        }, {"_id": 100553, "filter": "Photography", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.784Z", "__v": 0}, {
            "_id": 100554,
            "filter": "Presentation Design",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.787Z",
            "__v": 0
        }, {"_id": 100555, "filter": "Infographics", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.788Z", "__v": 0}]
    }, {
        "subFilter": "Creative and Ad Making",
        "arr": [{"_id": 100545, "filter": "Print Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.766Z", "__v": 0}, {
            "_id": 100546,
            "filter": "Videos",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.769Z",
            "__v": 0
        }, {"_id": 100547, "filter": "Animated Videos", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.772Z", "__v": 0}, {
            "_id": 100548,
            "filter": "Cinema Ads",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.773Z",
            "__v": 0
        }, {"_id": 100549, "filter": "Radio Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.775Z", "__v": 0}, {
            "_id": 100550,
            "filter": "Voiceover",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.777Z",
            "__v": 0
        }, {"_id": 100551, "filter": "Banner Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.779Z", "__v": 0}, {
            "_id": 100552,
            "filter": "Cartoonist",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.782Z",
            "__v": 0
        }, {"_id": 100553, "filter": "Photography", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.784Z", "__v": 0}, {
            "_id": 100554,
            "filter": "Presentation Design",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.787Z",
            "__v": 0
        }, {"_id": 100555, "filter": "Infographics", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.788Z", "__v": 0}]
    }, {
        "subFilter": "Creative and Ad Making",
        "arr": [{"_id": 100545, "filter": "Print Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.766Z", "__v": 0}, {
            "_id": 100546,
            "filter": "Videos",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.769Z",
            "__v": 0
        }, {"_id": 100547, "filter": "Animated Videos", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.772Z", "__v": 0}, {
            "_id": 100548,
            "filter": "Cinema Ads",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.773Z",
            "__v": 0
        }, {"_id": 100549, "filter": "Radio Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.775Z", "__v": 0}, {
            "_id": 100550,
            "filter": "Voiceover",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.777Z",
            "__v": 0
        }, {"_id": 100551, "filter": "Banner Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.779Z", "__v": 0}, {
            "_id": 100552,
            "filter": "Cartoonist",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.782Z",
            "__v": 0
        }, {"_id": 100553, "filter": "Photography", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.784Z", "__v": 0}, {
            "_id": 100554,
            "filter": "Presentation Design",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.787Z",
            "__v": 0
        }, {"_id": 100555, "filter": "Infographics", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.788Z", "__v": 0}]
    }, {
        "subFilter": "Creative and Ad Making",
        "arr": [{"_id": 100545, "filter": "Print Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.766Z", "__v": 0}, {
            "_id": 100546,
            "filter": "Videos",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.769Z",
            "__v": 0
        }, {"_id": 100547, "filter": "Animated Videos", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.772Z", "__v": 0}, {
            "_id": 100548,
            "filter": "Cinema Ads",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.773Z",
            "__v": 0
        }, {"_id": 100549, "filter": "Radio Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.775Z", "__v": 0}, {
            "_id": 100550,
            "filter": "Voiceover",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.777Z",
            "__v": 0
        }, {"_id": 100551, "filter": "Banner Ads", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.779Z", "__v": 0}, {
            "_id": 100552,
            "filter": "Cartoonist",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.782Z",
            "__v": 0
        }, {"_id": 100553, "filter": "Photography", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.784Z", "__v": 0}, {
            "_id": 100554,
            "filter": "Presentation Design",
            "type": "Creative and Ad Making",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.787Z",
            "__v": 0
        }, {"_id": 100555, "filter": "Infographics", "type": "Creative and Ad Making", "isActive": true, "created_at": "2016-07-29T08:05:47.788Z", "__v": 0}]
    }],
    "Marketing Advisor": [{
        "subFilter": "Marketing Advisor",
        "arr": [{"_id": 100556, "filter": "Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.790Z", "__v": 0}, {
            "_id": 100557,
            "filter": "Media Planning",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.792Z",
            "__v": 0
        }, {"_id": 100558, "filter": "Rural Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.794Z", "__v": 0}, {
            "_id": 100559,
            "filter": "Product Placement",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.796Z",
            "__v": 0
        }, {"_id": 100560, "filter": "Market Research", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.798Z", "__v": 0}, {
            "_id": 100561,
            "filter": "Loyalty Consulting",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.799Z",
            "__v": 0
        }]
    }, {
        "subFilter": "Marketing Advisor",
        "arr": [{"_id": 100556, "filter": "Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.790Z", "__v": 0}, {
            "_id": 100557,
            "filter": "Media Planning",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.792Z",
            "__v": 0
        }, {"_id": 100558, "filter": "Rural Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.794Z", "__v": 0}, {
            "_id": 100559,
            "filter": "Product Placement",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.796Z",
            "__v": 0
        }, {"_id": 100560, "filter": "Market Research", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.798Z", "__v": 0}, {
            "_id": 100561,
            "filter": "Loyalty Consulting",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.799Z",
            "__v": 0
        }]
    }, {
        "subFilter": "Marketing Advisor",
        "arr": [{"_id": 100556, "filter": "Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.790Z", "__v": 0}, {
            "_id": 100557,
            "filter": "Media Planning",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.792Z",
            "__v": 0
        }, {"_id": 100558, "filter": "Rural Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.794Z", "__v": 0}, {
            "_id": 100559,
            "filter": "Product Placement",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.796Z",
            "__v": 0
        }, {"_id": 100560, "filter": "Market Research", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.798Z", "__v": 0}, {
            "_id": 100561,
            "filter": "Loyalty Consulting",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.799Z",
            "__v": 0
        }]
    }, {
        "subFilter": "Marketing Advisor",
        "arr": [{"_id": 100556, "filter": "Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.790Z", "__v": 0}, {
            "_id": 100557,
            "filter": "Media Planning",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.792Z",
            "__v": 0
        }, {"_id": 100558, "filter": "Rural Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.794Z", "__v": 0}, {
            "_id": 100559,
            "filter": "Product Placement",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.796Z",
            "__v": 0
        }, {"_id": 100560, "filter": "Market Research", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.798Z", "__v": 0}, {
            "_id": 100561,
            "filter": "Loyalty Consulting",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.799Z",
            "__v": 0
        }]
    }, {
        "subFilter": "Marketing Advisor",
        "arr": [{"_id": 100556, "filter": "Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.790Z", "__v": 0}, {
            "_id": 100557,
            "filter": "Media Planning",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.792Z",
            "__v": 0
        }, {"_id": 100558, "filter": "Rural Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.794Z", "__v": 0}, {
            "_id": 100559,
            "filter": "Product Placement",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.796Z",
            "__v": 0
        }, {"_id": 100560, "filter": "Market Research", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.798Z", "__v": 0}, {
            "_id": 100561,
            "filter": "Loyalty Consulting",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.799Z",
            "__v": 0
        }]
    }, {
        "subFilter": "Marketing Advisor",
        "arr": [{"_id": 100556, "filter": "Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.790Z", "__v": 0}, {
            "_id": 100557,
            "filter": "Media Planning",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.792Z",
            "__v": 0
        }, {"_id": 100558, "filter": "Rural Marketing Planning", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.794Z", "__v": 0}, {
            "_id": 100559,
            "filter": "Product Placement",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.796Z",
            "__v": 0
        }, {"_id": 100560, "filter": "Market Research", "type": "Marketing Advisor", "isActive": true, "created_at": "2016-07-29T08:05:47.798Z", "__v": 0}, {
            "_id": 100561,
            "filter": "Loyalty Consulting",
            "type": "Marketing Advisor",
            "isActive": true,
            "created_at": "2016-07-29T08:05:47.799Z",
            "__v": 0
        }]
    }],
    "Bloggers and Influencers": [{"subFilter": "Bloggers and Influencers", "arr": [{"_id": 100562, "type": "Bloggers and Influencers", "isActive": true, "created_at": "2016-07-29T08:05:47.800Z", "__v": 0}]}],
    "Public Relations": [{"subFilter": "Public Relations", "arr": [{"_id": 100563, "type": "Public Relations", "isActive": true, "created_at": "2016-07-29T08:05:47.802Z", "__v": 0}]}],
    "Media Buying": [{"subFilter": "Media Buying", "arr": [{"_id": 100564, "type": "Media Buying", "isActive": true, "created_at": "2016-07-29T08:05:47.803Z", "__v": 0}]}],
    "Digital Marketing": [{"subFilter": "Digital Marketing", "arr": [{"_id": 100565, "type": "Digital Marketing", "isActive": true, "created_at": "2016-07-29T08:05:47.805Z", "__v": 0}]}],
    "Branding Services": [{"subFilter": "Branding Services", "arr": [{"_id": 100566, "type": "Branding Services", "isActive": true, "created_at": "2016-07-29T08:05:47.806Z", "__v": 0}]}]
}
