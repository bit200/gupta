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
                email: 'a@igenero.com',
                password: 'Test1234'
            }, cb, cb, {publish: true})
        });

        arrFunc.push(function (cb) {
            var freelancer = {
                "user": 100, "work": 100, "type": "agency",
                "name": "Siavash A",
                "introduction": "Senior IOS Developer",
                "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
                "popularity": 99999, "rating": 4,
                "isActive": 1, "registrationStatus": 1, "service_packages": [],
                "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
                "service_providers": ["Creative and Ad Making"],
                "cities": ["Mumbai"],
                "views": 21005
            };
            m.findCreate(models.Freelancer, freelancer)
        });

        arrFunc.push(function (cb) {

            freelancer = {
                "user": 101, "work": 101, "type": "agency",
                "name": "Soumya Nalam",
                "introduction": "Senior IOS Developer",
                "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
                "popularity": 95999, "rating": 4,
                "isActive": 1, "registrationStatus": 1, "service_packages": [],
                "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
                "service_providers": ["Content Writing"],
                "cities": ["Mumbai"],
                "views": 18005
            };
            m.findCreate(models.Freelancer, freelancer)
        });

        arrFunc.push(function (cb) {
            var freelancer = {
                "user": 102, "work": 102, "type": "agency",
                "name": "Shadrack K",
                "introduction": "Senior IOS Developer",
                "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
                "popularity": 94999, "rating": 2,
                "isActive": 1, "registrationStatus": 1, "service_packages": [],
                "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
                "service_providers": ["Bloggers and Influencers"],
                "cities": ["Mumbai"],
                "views": 15005
            };
            m.findCreate(models.Freelancer, freelancer)
        });

        arrFunc.push(function (cb) {
            var freelancer = {
                "user": 103, "work": 103, "type": "agency",
                "name": "Mohamed M. A.",
                "introduction": "Senior IOS Developer",
                "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
                "popularity": 93999, "rating": 4,
                "isActive": 1, "registrationStatus": 1, "service_packages": [],
                "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
                "service_providers": ["Bloggers and Influencers"],
                "cities": ["Mumbai"],
                "views": 12005
            };
            m.findCreate(models.Freelancer, freelancer)
        });

        arrFunc.push(function (cb) {
            var freelancer = {
                "user": 104, "work": 104, "type": "agency",
                "name": "David Kibra",
                "introduction": "Senior IOS Developer",
                "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
                "popularity": 92999, "rating": 4,
                "isActive": 1, "registrationStatus": 1, "service_packages": [],
                "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
                "service_providers": ["Event Management"],
                "cities": ["Mumbai"],
                "views": 11005
            };
            m.findCreate(models.Freelancer, freelancer)
        });

        arrFunc.push(function (cb) {
            var freelancer = {
                "user": 105, "work": 105, "type": "agency",
                "name": "Emma Davidson",
                "introduction": "Senior IOS Developer",
                "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
                "popularity": 90999, "rating": 4,
                "isActive": 1, "registrationStatus": 1, "service_packages": [],
                "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
                "service_providers": ["Content Writing"],
                "cities": ["Mumbai"],
                "views": 10005
            };
            m.findCreate(models.Freelancer, freelancer);
        });

        arrFunc.push(function (cb) {
            var freelancer = {
                "user": 106, "work": 106, "type": "agency",
                "name": "Retha Groenewald",
                "introduction": "Senior IOS Developer",
                "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
                "popularity": 89999, "rating": 4,
                "isActive": 1, "registrationStatus": 1, "service_packages": [],
                "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
                "service_providers": ["Direct Marketing"],
                "cities": ["Mumbai"],
                "views": 9000
            };
            m.findCreate(models.Freelancer, freelancer);
        });

        arrFunc.push(function (cb) {
            var freelancer = {
                "user": 106, "work": 106, "type": "agency",
                "name": "Leeanna Weideman",
                "introduction": "Senior IOS Developer",
                "description": "Lorem ipsum dolor sit amet, consecretur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ",
                "popularity": 89999, "rating": 4,
                "isActive": 1, "registrationStatus": 1, "service_packages": [],
                "price": {"hour": null, "word": 10}, "languages": ["Spanish"], "content_type": ["Blogs and Articles"], "industry_expertise": ["Sports", "Technology", "Automotive", "Lifestyle"],
                "service_providers": ["Media Planning"],
                "cities": ["Mumbai"],
                "views": 9000
            };
            m.findCreate(models.Freelancer, freelancer);
        });

        arrFunc.push(function (cb) {
            var job = {
                "job_visibility": true,
                "title": "Technical Writing & Creative Writing",
                "description": "Proven UI experience. We are looking for a talented Web / UI Designer to create amazing user experiences. A Reputed UK based Software Company is looking for a...",
                "budget": 10000,
                "mobile": "+5944-345-345-4",
                "client_name": "Sqall Leonhart",
                "company_name": "BEST NaME EVER",
                "website": "elefant",
                "type_category": "Content Writing",
                "type_filter": "Languages",
                "type_name": "German",
                "email": "jiga-san@mail.ru",
                "user": 100002,
                "buyer": 100002,
                "status": "open",
                "contracts": [],
                "admin_approved": 1,

                "local_preference": [
                    "Hyderabat"
                ]
            };
            m.findCreate(models.Job, job);
        });

        arrFunc.push(function (cb) {
            var job = {
                "job_visibility": true,
                "title": "Editor, Writer, Technical writer",
                "description": "Proven UI experience. We are looking for a talented Web / UI Designer to create amazing user experiences. A Reputed UK based Software Company is looking for a...",
                "budget": 10000,
                "mobile": "+5944-345-345-4",
                "client_name": "Sqall Leonhart",
                "company_name": "BEST NaME EVER",
                "website": "elefant",
                "type_category": "Content Writing",
                "type_filter": "Languages",
                "type_name": "German",
                "email": "jiga-san@mail.ru",
                "user": 100002,
                "buyer": 100002,
                "status": "open",
                "contracts": [],
                "admin_approved": 1,
                "local_preference": [
                    "Hyderabat"
                ]
            };
            m.findCreate(models.Job, job);
        });

        arrFunc.push(function (cb) {
            var job = {
                "job_visibility": true,
                "title": "Copywriter. Technical writer. Editor",
                "description": "Proven UI experience. We are looking for a talented Web / UI Designer to create amazing user experiences. A Reputed UK based Software Company is looking for a...",
                "budget": 10000,
                "mobile": "+5944-345-345-4",
                "client_name": "Sqall Leonhart",
                "company_name": "BEST NaME EVER",
                "website": "elefant",
                "type_category": "Content Writing",
                "type_filter": "Languages",
                "type_name": "German",
                "email": "jiga-san@mail.ru",
                "user": 100002,
                "buyer": 100002,
                "status": "open",
                "contracts": [],
                "admin_approved": 1,
                "local_preference": [
                    "Hyderabat"
                ]
            };
            m.findCreate(models.Job, job);
        });

        arrFunc.push(function (cb) {
            var job = {
                "job_visibility": true,
                "title": "Business writing consultant",
                "description": "Proven UI experience. We are looking for a talented Web / UI Designer to create amazing user experiences. A Reputed UK based Software Company is looking for a...",
                "budget": 10000,
                "mobile": "+5944-345-345-4",
                "client_name": "Sqall Leonhart",
                "company_name": "BEST NaME EVER",
                "website": "elefant",
                "type_category": "Content Writing",
                "type_filter": "Languages",
                "type_name": "German",
                "email": "jiga-san@mail.ru",
                "user": 100002,
                "buyer": 100002,
                "status": "open",
                "contracts": [],
                "admin_approved": 1,
                "local_preference": [
                    "Hyderabat"
                ]
            };
            m.findCreate(models.Job, job);
        });

        arrFunc.push(function (cb) {
            var arr = ['Blogs and Articles', 'Copywriting / Web Content', 'Technical Writing', 'Press Release Writing', 'Proof Reading', 'Books and Magazines', 'Translation'];
            findCreateFilter('Content Writing', 'Content Type', arr, cb)
        });

        arrFunc.push(function (cb) {
            var arr = ['Health and Fitness', 'Business and Finance', 'Kids and Parenting', 'Sports', 'Travel & Tourism', 'Education', 'Technology', 'Science', 'Real Estate',
                'Automotive', 'Food and Beverages', 'Media and Entertainment', 'Lifestyle'];
            findCreateFilter('Content Writing', 'Industry Expertise', arr, cb)
        });

        arrFunc.push(function (cb) {
            var arr = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi',
                'Urdu', 'Punjabi', 'French', 'German', 'Spanish', 'Japanese', 'Chinese'];
            findCreateFilter('Content Writing', 'Languages', arr, cb)
        });

        arrFunc.push(function (cb) {
            var arr = ['Health and Fitness', 'Business and Finance', 'Kids and Parenting', 'Sports', 'Travel and Tourism', 'Education',
                'Technology', 'Science', 'Real Estate', 'Automotive', 'Food and Beverages', 'Lifestyle', 'Mobile and Gadgets',
                'Fashion and Beauty', 'Cooking', 'Vernacular Language', 'Books and Reading'];
            findCreateFilter('Bloggers and Influencers', 'Industry Expertise', arr, cb)
        });

        arrFunc.push(function (cb) {
            var arr = ['Web Blog', 'Video Blog', 'Social Influencer'];
            findCreateFilter('Bloggers and Influencers', 'Blog Type', arr, cb)
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

        async.parallel(arrFunc, function () {
            console.log('Filters created');
            done()
        })

    });
};


