'use strict';

/* App Module */

var XYZApp = angular.module('XYZApp', [
    'ngRoute',
    'XYZCtrls'
]);

XYZApp.config(['$routeProvider', '$httpProvider',
    function ($routeProvider, $httpProvider) {
        var checkAuthCtrl = function($q, $rootScope){
            var deferred = $q.defer();
            var token = window.localStorage.getItem('accessToken');
            if (token) deferred.resolve()
            else {
                $rootScope.go('/login')
                deferred.reject()
            }
            return deferred.promise;
        }
        var checkAuthLogin = function($q, $rootScope){
            var deferred = $q.defer();
            var token = window.localStorage.getItem('accessToken');
            if (token) {
                $rootScope.go('/home')
                deferred.reject()
            }else {
                deferred.resolve()
            }
            return deferred.promise;
        }
        $routeProvider
            .when('/registration', {
                templateUrl: 'template/registration.html',
                controller: 'HomeCtrl',
                resolve: {
                    auth: checkAuthLogin
                }
            })
            .when('/login', {
                templateUrl: 'template/login.html',
                controller: 'MainCtrl',
                resolve: {
                    auth: checkAuthLogin
                }
            })
            .when('/forgot/email', {
                templateUrl: 'template/forgotEmail.html',
                controller: 'forgotCtrl',
                resolve: {
                    auth: checkAuthLogin
                }

            })
            .when('/forgot/restore/:restoreCode', {
                templateUrl: 'template/forgotRestore.html',
                controller: 'forgotCtrl'
            })
            .when('/home', {
                templateUrl: 'template/home.html',
                controller: 'HomeCtrl',
                resolve: {
                    auth: checkAuthCtrl
                }
            })
            .when('/agency', {
                templateUrl: 'template/agency.html',
                controller: 'agencyCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function($q, $http){
                        return $q.all({
                                agency: $http.get('/get-agency')
                        })
                    }
                }
            })
            .when('/post-job', {
                templateUrl: 'template/PostJob.html',
                controller: 'jobCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function($q, $http){
                        return $q.all({
                            contentType: $http.get('/get-content', {params: {name: 'Filters', query: {type:'ContentWriting',filter: 'Content Type'}, distinctName: 'name'}}),
                            locations:$http.get('/get-content', {params: {name: 'Location', query: {}, distinctName: 'name'}})
                        })
                    }
                }
            })
            .when('/freelancer-registration', {
                templateUrl: 'template/freelanceRegistration.html',
                controller: 'freelancerCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function($q, $http){
                        return $q.all({
                            industry: $http.get('/get-content', {params: {name: 'Filters', query: {type:'BloggersAndInfluencers',filter: 'Industry Expertise'}, distinctName: 'name'}}),
                            content:$http.get('/get-content', {params: {name: 'Filters', query: {type:'ContentWriting',filter: 'Content Type'}, distinctName: 'name'}}),
                            languages:$http.get('/get-content', {params: {name: 'Filters', query: {type:'ContentWriting',filter: 'Languages'}, distinctName: 'name'}}),
                            freelancerType:$http.get('/get-content', {params: {name: 'Filters', query: {type:'FreelancerType'}, distinctName: 'name'}}),
                            locations:$http.get('/get-content', {params: {name: 'Location', query: {}, distinctName: 'name'}})
                        })
                    }
                }
            })

            .otherwise({redirectTo: '/login'});

        $httpProvider.interceptors.push(function ($q) {
            return {
                'responseError': function (rejection) {
                    if (rejection.status === 402) {
                        localStorage.clear();
                        location.reload();
                    }
                    return $q.reject(rejection);
                },
                request: function (config) {
                    if(localStorage.getItem('accessToken')){
                        config.headers['authorization'] = localStorage.getItem('accessToken');
                    }
                    return config;
                }
            };
        });
    }
]);

XYZApp.run(function($rootScope, $location){
    $rootScope.go = function(path){
        $location.path(path)
    }
})