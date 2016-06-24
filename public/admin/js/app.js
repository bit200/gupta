'use strict';

/* App Module */

var XYZAdmin = angular.module('XYZAdmin', [
    'ngRoute',
    'XYZAdminCtrls',
    'bw.paging',
    'angularModalService',
    'ngMaterial',
    'ngDialog'
]);

XYZAdmin.config(['$routeProvider', '$httpProvider',
    function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'loginCtrl'
            })
            .when('/users', {
                templateUrl: 'templates/users.html',
                controller: 'userCtrl',
                resolve: {
                    getContent: function ($q, $http) {
                        return $q.all({
                            users: $http.get('/get-users')
                        })
                    }
                }

            })
            .when('/claims', {
                templateUrl: 'templates/claims.html',
                controller: 'claimCtrl',
                resolve: {
                    getContent: function ($q, $http) {
                        return $q.all({
                            agency: $http.get('/get-business-users')
                        })
                    }
                }

            })
            .when('/jobs', {
                templateUrl: 'templates/jobs.html',
                controller: 'jobCtrl',
                resolve: {
                    getContent: function ($q, $http) {
                        return $q.all({
                            job: $http.get('/get-job')
                        })
                    }
                }

            })
            .when('/sellers', {
                templateUrl: 'templates/sellers.html',
                controller: 'sellerCtrl',
                resolve: {
                    getContent: function ($q, $http) {
                        return $q.all({
                            sellers: $http.get('/freelancer'),
                            service: $http.get('/get-content', {
                                params: {
                                    name: 'ServiceProvider',
                                    query: {},
                                    distinctName: 'name'
                                }
                            }),
                            locations: $http.get('/get-content', {
                                params: {
                                    name: 'Location',
                                    query: {},
                                    distinctName: 'name'
                                }
                            }),
                            industry: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'BloggersAndInfluencers', filter: 'Industry Expertise'},
                                    distinctName: 'name'
                                }
                            }),
                            content: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'ContentWriting', filter: 'Content Type'},
                                    distinctName: 'name'
                                }
                            }),
                            languages: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'ContentWriting', filter: 'Languages'},
                                    distinctName: 'name'
                                }
                            }),
                            freelancerType: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'FreelancerType'},
                                    distinctName: 'name'
                                }
                            }),
                            clients: $http.get('/get-client')
                        })
                    }
                }

            })

            .when('/category', {
                templateUrl: 'templates/category.html',
                controller: 'categoryCtrl',
                resolve: {
                    getContent: function ($q, $http) {
                        return $q.all({
                            service: $http.get('/get-content', {
                                params: {
                                    name: 'ServiceProvider',
                                    query: {},
                                    distinctName: 'name'
                                }
                            }),
                            contentType: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'ContentWriting', filter: 'Content Type'},
                                    distinctName: 'name'
                                }
                            })
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

