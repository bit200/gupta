'use strict';

/* App Module */

var XYZApp = angular.module('XYZApp', [
    'ngRoute',
    'XYZCtrls'
]);

XYZApp.config(['$routeProvider', '$httpProvider',
    function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/registration', {
                templateUrl: 'template/registration.html',
                controller: 'HomeCtrl'
            })
            .when('/login', {
                templateUrl: 'template/login.html',
                controller: 'MainCtrl'
            })
            .when('/home', {
                templateUrl: 'template/home.html',
                controller: 'HomeCtrl'
            })
            .when('/agency', {
                templateUrl: 'template/agency.html',
                controller: 'agencyCtrl',
                resolve: {
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
