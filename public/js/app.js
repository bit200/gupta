'use strict';

/* App Module */

var XYZApp = angular.module('XYZApp', [
    'ngRoute',
    'XYZCtrls'
]);

XYZApp.config(['$routeProvider', '$httpProvider',
    function ($routeProvider,$httpProvider ) {
        $routeProvider
            .when('/registration', {
                templateUrl: 'template/registration.html',
                controller: 'MainCtrl'
            })
            .when('/login', {
                templateUrl: 'template/login.html',
                controller: 'MainCtrl'
            })
            .when('/home', {
                templateUrl: 'template/home.html',
                controller: 'MainCtrl'
            })
            .otherwise({redirectTo: '/login'});

        $httpProvider.interceptors.push(function ($q) {
            return {
                'responseError': function (rejection) {
                    if(rejection.status === 402) {
                        localStorage.clear();
                        location.reload();
                    }
                    return $q.reject(rejection);
                }
            };
        });
    }
]);
