/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HomeCtrl', ['$scope', '$location', '$http', '$q', 'getContent', function (scope, location, http, $q, getContent) {

    scope.cancelRegistration = function () {
        location.path('/')
    };

    scope.link = function (url) {
        location.path(url)
    };


    scope.arrayProviders = getContent.service.data.data;

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
            'Job Title': 'Hard job',
            'Job Category': 'hard',
            'Job Specifics': 'Nothing',
            'Location Preference': '1 24rw r124rwrq',
            'Budget(max)': 20
        },
        {
            'Job Title': 'Easy job',
            'Job Category': 'easy',
            'Job Specifics': 'Just do it',
            'Location Preference': 'i76iuy iy7iy',
            'Budget(max)': 9999999999999
        }
    ]


}]);