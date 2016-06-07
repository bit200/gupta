'use strict';

/* App Module */

var XYZAdmin = angular.module('XYZAdmin', [
    'ngRoute',
    'XYZAdminCtrls',
    'bw.paging'
]);

XYZAdmin.config(['$routeProvider', '$httpProvider',
    function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'loginCtrl'
            })
            .when('/main', {
                templateUrl: 'files.html',
                controller: 'mainCtrl',
                resolve: {
                    getContent: function ($q, $http) {
                        return $q.all({
                            users: $http.get('/get-users')
                        })
                    }
                }

            })
            .otherwise({redirectTo: '/login'});
        
        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                'responseError': function (rejection) {
                    if (rejection.status === 401 || rejection.status === 402 || rejection.status === 403) {
                        localStorage.clear();
                        $location.path('/login');
                    }
                    return $q.reject(rejection);
                },
                request: function (config) {
                    if (localStorage.getItem('accessToken')) {
                        config.headers['authorization'] = localStorage.getItem('accessToken');
                    }
                    return config;
                }
            };
        });
    }
]);

