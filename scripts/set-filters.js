var config = require('../app/config'),
    m = require(config.root + 'app/m'),
    models = require(config.root + 'app/db'),
    _ = require('underscore'),
    Location = models.Location,
    async = require('async');


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

module.exports = function (done) {
    Location.count().exec(function (err, count) {
        if (count) return done();
        console.log('.....Creating filters.....');
        var arrFunc = [];
        arrFunc.push(function (cb) {
            m.create(models.Admin, {
                email: 'roruslanvl@gmail.com',
                password: 'Test1234'
            }, cb, cb, {publish: true})
        });

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

        arrFunc.push(function (cb) {

        var arr = [
        {
            "type" : "freelancer",
            "name" : "test2 test2",
            "introduction" : "asfdasdasd",
            "description" : "asdasda",
            "location" : "Delhi",
            "user" : 100080,
            "rating" : 1,
            "popularity" : 1,
            "view" : 1900,
            "service_type" : "word",
            "service_price" : 1,
            "poster" : "http://2.bp.blogspot.com/-mxUOaP7O7zE/VAnmIljIGoI/AAAAAAAANN0/UmtA1zptSSs/s1600/_DSC4232.jpg",
            "languages" : [
            "Marathi",
            "Telugu"
        ],
            "content_type" : [
            "Press Release Writing"
        ],
            "industry_expertise" : [
            "Health and Fitness",
            "Travel and Tourism",
            "Science"
        ],
            "freelancer_type" : [
            "Digital Marketing"
        ],
            "cities_service" : []
        },


        {
            "type" : "agency",
            "name" : "test test",
            "introduction" : "asfdasdasd",
            "description" : "asdasda",
            "location" : "Delhi",
            "user" : 100022,
            "rating" : 4,
            "popularity" : 4,
            "view" : 999,
            "service_type" : "hour",
            "service_price" : 551,
            "poster" : "http://svit24.net/images/stories/articles/2012/Curiosities/01-2012/-%D0%B8%D0%BD%D0%B4%D1%83%D1%81.jpg",
            "languages" : [
            "Marathi",
            "Telugu"
        ],
            "content_type" : [
            "Press Release Writing"
        ],
            "industry_expertise" : [
            "Health and Fitness",
            "Travel and Tourism",
            "Science"
        ],
            "freelancer_type" : [
            "Digital Marketing"
        ],
            "cities_service" : []
        },

            {
            "type" : "freelancer",
            "name" : "test3 test3",
            "introduction" : "asfdasdasd",
            "description" : "asdasda",
            "location" : "Delhi",
            "user" : 100023,
            "rating" : 3,
            "popularity" : 3,
            "view" : 78,
            "service_type" : "word",
            "service_price" : 8,
            "poster" : "https://pp.vk.me/c9249/v9249019/85e/U5hcz7MPt58.jpg",
            "languages" : [
            "Marathi",
            "Telugu"
        ],
            "content_type" : [
            "Press Release Writing"
        ],
            "industry_expertise" : [
            "Health and Fitness",
            "Travel and Tourism",
            "Science"
        ],
            "freelancer_type" : [
            "Digital Marketing"
        ],
            "cities_service" : []
        },
        {
            "type" : "agency",
            "name" : "test test",
            "introduction" : "asfdasdasd",
            "description" : "asdasda",
            "location" : "Delhi",
            "user" : 100025,
            "rating" : 5,
            "popularity" : 5,
            "view" : 545,
            "service_type" : "hour",
            "service_price" : 3000,
            "poster" : "http://peshera.org/khrono/Fotos-19/foto-118.jpg",
            "languages" : [
            "Marathi",
            "Telugu"
        ],
            "content_type" : [
            "Press Release Writing"
        ],
            "industry_expertise" : [
            "Health and Fitness",
            "Travel and Tourism",
            "Science"
        ],
            "freelancer_type" : [
            "Digital Marketing"
        ],
            "cities_service" : []
        },
        {
            "type" : "freelancer",
            "name" : "test test",
            "introduction" : "asfdasdasd",
            "description" : "asdasda",
            "location" : "Delhi",
            "user" : 100028,
            "rating" : 3,
            "popularity" : 3,
            "view" : 20,
            "service_type" : "word",
            "service_price" : 24,
            "poster" : "http://f1-legend.ru/_ld/18/08806603.jpg",
            "languages" : [
            "Marathi",
            "Telugu"
        ],
            "content_type" : [
            "Press Release Writing"
        ],
            "industry_expertise" : [
            "Health and Fitness",
            "Travel and Tourism",
            "Science"
        ],
            "freelancer_type" : [
            "Digital Marketing"
        ],
            "cities_service" : []
        },
        {
            "type" : "agency",
            "name" : "test test",
            "introduction" : "asfdasdasd",
            "description" : "asdasda",
            "location" : "Delhi",
            "user" : 100033,
            "rating" : 2,
            "popularity" : 2,
            "view" : 130,
            "poster" : "http://f2.s.qip.ru/15A7EBwSn.jpg",
            "service_type" : "word",
            "service_price" : 20,
            "languages" : [
            "Marathi",
            "Telugu"
        ],
            "content_type" : [
            "Press Release Writing"
        ],
            "industry_expertise" : [
            "Health and Fitness",
            "Travel and Tourism",
            "Science"
        ],
            "freelancer_type" : [
            "Digital Marketing"
        ],
            "cities_service" : []
        }];
            var count = 0;
            _.forEach(arr, function (item) {
                m.findCreate(models.Freealncer, item, {}, {}, function () {
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


