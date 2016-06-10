'use strict';
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/* Controllers */
var XYZCtrls = angular.module('XYZCtrls', []);

XYZCtrls.controller('MainCtrl', ['$scope', '$location', '$http', function (scope, location, http) {
    scope.auth = window.localStorage.getItem('accessToken');
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
    scope.registration = function (invalid, data) {
        if (invalid) return
        http.post('/sign-up', data).then(function (resp) {
                location.path('/')
            }, function (err, r) {
            }
        )
    };

    scope.cancelRegistration = function () {
        location.path('/')
    };

    scope.link = function (url) {
        location.path(url)
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

XYZCtrls.controller('jobCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', function (scope, location, http, parseType, $q, getContent) {
    scope.job = {
        public: true,
        agency: true
    };
    scope.contentTypes = getContent.contentType.data.data;
    scope.locations = getContent.locations.data.data;

    scope.arrayProvidersModel = parseType.getModel(scope.contentTypes);

    scope.addJob = function (job) {
        job.content_types = parseType.get(job.content, scope.contentTypes);
        job.local_preference = parseType.get(job.location, scope.locations);
        job.job_visibility = job.private ? job.private : job.public;
        job.type = job.agency ? 'Agency' : 'Freelancer';
        http.post('/job', job).then(function (resp) {
                location.path('/home')
            }, function (err, r) {
            }
        )
    };


}]);

XYZCtrls.controller('forgotCtrl', ['$scope', '$location', '$http', '$routeParams', function (scope, location, http, routeParams) {
    scope.send = true;
    scope.submitted = false;
    scope.button = 'Send';
    scope.restore = function (valid, email) {
        scope.error = "";
        if (valid) return;
        scope.button = 'Wait';
        http.get('/send-restore', {params: {email: email}}).then(function (resp) {
            scope.send = false;
        }, function (err) {
            scope.button = 'Send';
            scope.error = "Email not found!"
        })
    };
    scope._restore = false;
    scope.restorePassword = function(password){
        http.get('/restore', {params:{restore_code:routeParams.restoreCode,password:password}}).then(function(resp){
            console.log('resp', resp);
            scope._restore = true;
            scope.restoreText = 'Password have been changed.'
        }, function(err){
            scope.restoreText = 'Password was changed by this restore code'
        })
    }


}]);

XYZCtrls.controller('freelancerCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', function (scope, location, http, parseType, $q, getContent) {
    scope.freelancer = {isagency: true};
    scope.industry = getContent.industry.data.data;
    scope.content = getContent.content.data.data;
    scope.language = getContent.languages.data.data;
    scope.freelancerType = getContent.freelancerType.data.data;
    scope.locations = getContent.locations.data.data;
    scope.experience = _.range(51);

    scope.contentModel = parseType.getModel(scope.content);

    scope.register = function (freelancer) {
        freelancer.freelancer_type = parseType.getByNumber(freelancer.type, scope.freelancerType);
        freelancer.industry_expertise = parseType.getByNumber(freelancer.industries, scope.industry);
        freelancer.cities_service = parseType.get(freelancer.cities, scope.locations);
        freelancer.content_type = parseType.get(freelancer.contents, scope.content);
        freelancer.languages = parseType.get(freelancer.languages, scope.language);
        freelancer.type = freelancer.isagency ? 'Agency' : 'Freelancer';
        http.post('/freelancer', freelancer).then(function (resp) {
                location.path('/home')
            }, function (err, r) {
            }
        )
    };
}]);

XYZCtrls.controller('agencyCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', function (scope, location, http, parseType, $q, getContent) {
    scope.requestBusiness = false;
    scope.agency = parseType.agency(getContent.agency.data.data);
    scope.claim = function (agency) {
        scope.choiceAgency = agency;
        scope.requestBusiness = true;
    };

    scope.sendRequest = function (data) {
        scope.req = {
            data: data,
            agency: scope.choiceAgency
        };
        http.post('/request-business', scope.req).then(function (resp) {
            scope.requestBusiness = false;
            _.forEach(scope.agency, function (item) {
                if (item['Agency Name'] == scope.choiceAgency) {
                    item.Status = true
                }
            })
        })
    };
}]);
