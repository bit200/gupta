'use strict';
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/* Controllers */
var XYZCtrls = angular.module('XYZCtrls', []);

XYZCtrls.controller('MainCtrl', ['$scope', '$location', '$http', function (scope, location, http) {
    scope.auth = window.localStorage.getItem('accessToken');
    if (!scope.auth) {
        location.path('/login')
    } else {
        location.path('/home')
    }
    scope.signin = function (data) {
        http.get('/sign-in', {params: {login: data.login, password: data.password}}).then(function (resp) {
                if (resp.status == 200) {
                    localStorage.setItem('accessToken', resp.data.data.accessToken.value);
                    localStorage.setItem('refreshToken', resp.data.data.refreshToken.value);
                    location.path('home')
                }
            },
            function (err) {
                if (err.data.error == 'Item not found') {
                    scope.error = 'User with this login not found';
                    scope.errL = true;
                } else {
                    scope.errP = true;
                    scope.error = 'Password not correct'
                }
            })
    };

}]);

XYZCtrls.controller('HomeCtrl', ['$scope', '$location', '$http', function (scope, location, http) {


    scope.registration = function (data) {
        data.male ? data.sex = 'Male' : data.female ? data.sex = 'female' : data.sex;
        delete data.male;
        delete data.female;
        http.post('/sign-up', data).then(function (resp) {
                location.path('/')
            }, function (err, r) {
            }
        )
    };

    scope.cancelRegistration = function () {
        location.path('/')
    };

    scope.postjob = function () {
        location.path('/post-job')
    };

    scope.logout = function () {
        localStorage.clear();
        location.path('/login')
    };


    scope.arrayProviders = ['Content Writing', 'Creative and Ad Making', 'Public Relations', 'Bloggers and Influencers',
        'Digital Marketing', 'Branding Services', 'Event Management', 'Direct Marketing', 'Media Planning', 'Media Buying']


    scope.profiles = [
        {
            poster: 'http://www.gizmonews.ru/wp-content/uploads/2013/01/gold-shirt-guy-550x699.jpg',
            name: 'Darshit Lal',
            rating: [1, 1, 1, 1, 0],
            popularity: [1, 1, 0, 0]
        },
        {
            poster: 'http://www.vokrug.tv/pic/product/5/1/8/b/medium_518b990ee260dea2fa9b3df92a7a4020.png',
            name: 'Madhup Nanda',
            rating: [1, 1, 1, 0, 0],
            popularity: [1, 1, 1, 0]
        }
        ,
        {},
        {}
    ];

    scope.jobs = [
        {
            'Job Title': 'werwerwerwerwe',
            'Job Category': 'erwerwerwerwerwer',
            'Job Specifics': 'zxcxzczxczxczxczx',
            'Location Preference': '124rwr124rwrq',
            'Budget(max)': 2352323423
        },
        {
            'Job Title': 'piopiopiopiop',
            'Job Category': 'k;kl;kl;kl;kl',
            'Job Specifics': 'ghjhjghjghjghj',
            'Location Preference': 'i76iuyiy7iy',
            'Budget(max)': 676786786786
        }
    ]

}]);

XYZCtrls.controller('jobCtrl', ['$scope', '$location', '$http', function (scope, location, http) {
    scope.job = {
        public: true,
        agency: true
    };

    scope.addJob = function (job) {
        job.content_types = parseType(job.content, scope.contentTypes)
        job.local_preference = parseType(job.location, scope.locations)
        job.job_visibility = job.private ? job.private : job.public;
        job.type = job.agency ? 'Agency' : 'Freelancer';
        http.post('/job', job).then(function (resp) {
                location.path('/home')
            }, function (err, r) {
            }
        )
        console.log('end', job)
    };

    scope.contentTypes = ['Blogs and Articles', 'Copywriting / Web Content', 'Technical Writing', 'Press Release Writing', 'Proof Reading', 'Books and Magazines', 'Translation'];
    scope.locations = ['Mumbai', 'Delhi', 'Bangalore'];
    scope.arrayProvidersModel = [];

    scope.contentTypes.forEach(function (item) {
        scope.arrayProvidersModel.push(item.split(' ').shift())
    });

    function parseType(item, Arr) {
        var arr = [];
        _.forEach(item, function (value, key) {
            _.forEach(Arr, function (el) {
                if (el.indexOf(key) > -1 && value) {
                    arr.push(el);
                }
            })
        });
        return arr
    }
}]);

XYZCtrls.controller('freelancerCtrl', ['$scope', '$location', '$http', function (scope, location, http) {
    scope.industry = ['Health and Fitness', 'Business and Finance', 'Kids and Parenting', 'Sports',
        'Travel & Tourism', 'Education', 'Technology', 'Science', 'Real Estate',
        'Automotive', 'Food and Beverages', 'Media and Entertainment', 'Lifestyle'];
    scope.industryModel = [];
    scope.industry.forEach(function (item) {
        scope.industryModel.push(item.split(' ').shift())
    });

    scope.content = ['Blogs and Articles', 'Copywriting / Web Content', 'Technical Writing',
        'Press Release Writing', 'Proofreading', 'Books and Magazines', 'Translation'];
    scope.contentModel = [];
    scope.content.forEach(function (item) {
        scope.contentModel.push(item.split(' ').shift())
    });

    scope.language = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi',
        'Urdu', 'Punjabi', 'French', 'German', 'Spanish', 'Japanese', 'Chinese'];



    scope.register = function(freelanser) {

    };


    function parseType(item, Arr) {
        var arr = [];
        _.forEach(item, function (value, key) {
            _.forEach(Arr, function (el) {
                if (el.indexOf(key) > -1 && value) {
                    arr.push(el);
                }
            })
        });
        return arr
    }
}])




