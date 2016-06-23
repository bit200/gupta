/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HomeCtrl', ['$scope', '$http', '$q', 'getContent', function (scope, http, $q, getContent) {


    scope.arrayProviders = getContent.service.data.data;

    scope.profiles = [
        {
            poster: 'http://2.gravatar.com/avatar/b81520ea04d296bbf07052a36b1dc543?s=234&d=mm&r=g',
            name: 'John Nash',
            rating: [1, 1, 1, 1, 0],
            popularity: [1, 1, 0, 0]
        },
        {
            poster: 'http://www.grapessoftware.com/wp-content/uploads/2014/02/Hire-Developer-Sprite.png',
            name: 'Kenneth Symons',
            rating: [1, 1, 1, 0, 0],
            popularity: [1, 1, 1, 0]
        },
        {
            poster: 'https://odesk-prod-portraits.s3.amazonaws.com/Users:iosware-mobi:PortraitUrl_100?AWSAccessKeyId=1XVAX3FNQZAFC9GJCFR2&Expires=2147483647&Signature=3c63jaN8sAbSQibZ%2FpsKoJ5T8xM%3D&1457601951605782',
            name: 'Artur Konor',
            rating: [1, 1, 1, 0, 0],
            popularity: [1, 1, 1, 0]
        },
        {
            poster: 'https://www.host.al/assets/img/avatar.png',
            name: 'David Grabovski',
            rating: [1, 1, 1, 0, 0],
            popularity: [1, 1, 1, 0]
        }
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