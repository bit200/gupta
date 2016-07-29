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
            findCreateFilter('Content and Translation','', arr, cb)
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