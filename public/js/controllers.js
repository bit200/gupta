'use strict';
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/* Controllers */
var XYZCtrls = angular.module('XYZCtrls', []);

XYZCtrls.controller('MainCtrl', ['$scope', '$location', '$http', function (scope, location, http) {
    scope.auth = window.localStorage.getItem('accessToken');
    if(!scope.auth){
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
        function(err){
            if(err.data.error == 'Item not found') {
                scope.error = 'User with this login not found';
                scope.errL = true;
            } else {
                scope.errP = true;
                scope.error = 'Password not correct'
            }
        })
    };

    scope.registration = function (data) {
        data.male? data.sex = 'Male' : data.female? data.sex = 'female': data.sex;
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
    ]

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

    scope.contentTypes = ['Blogs and Articles', 'Copywriting/Web Content', 'Technical Writing', 'Press Release Writing', 'Proof Reading', 'Books and Magazines', 'Translation']
    scope.locations = ['Mumbai', 'Delhi', 'Bangalore']
}]);




