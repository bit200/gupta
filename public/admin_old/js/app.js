'use strict';

/* App Module */

var XYZAdmin = angular.module('XYZAdmin', [
    'ngRoute',
    'XYZAdminCtrls',
    'bw.paging',
    'angularModalService',
    'ngMaterial',
    'ngDialog',
    'cgNotify',
    'angular-loading-bar'
]);
XYZAdmin.config(['$routeProvider', '$httpProvider', 'cfpLoadingBarProvider', 
    function ($routeProvider, $httpProvider, cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;

        var authResolve = ["$q", "AuthService", '$rootScope', function ($q, AuthService) {
            var deferred = $q.defer();
            AuthService.checkAuthCtrl().then(function () {
                deferred.resolve();
            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        }];

        $routeProvider
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'loginCtrl'
            })
            .when('/users', {
                templateUrl: 'templates/users.html',
                controller: 'userCtrl',
                resolve: {
                    auth: authResolve,
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
                    auth: authResolve,
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
                    auth: authResolve,
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
                    auth: authResolve,
                    getContent: function ($q, $http) {
                        return $q.all({
                            sellers: $http.get('/admin/sellers?registrationStatus=0'),
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
                    auth: authResolve,
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
                        // $location.path('/login');
                    }
                    return $q.reject(rejection);
                }
            };
        });
    }
]);

