'use strict';

/* App Module */
var XYZCtrls = angular.module('XYZCtrls', [])
var XYZApp = angular.module('XYZApp', [
    'angularModalService',
    'ngMaterial',
    'ngRoute',
    'rzModule',
    'ui.select',
    'ngDialog',
    'cgNotify',
    'XYZCtrls',
    'ngFileUpload'
]);

XYZApp.config(['$routeProvider', '$httpProvider', '$locationProvider',
    function ($routeProvider, $httpProvider,$locationProvider) {
        var checkAuthCtrl = function ($q, $rootScope) {
            var deferred = $q.defer();
            var token = window.localStorage.getItem('accessToken');
            if (token) deferred.resolve()
            else {
                $rootScope.go('/login')
                deferred.reject()
            }
            return deferred.promise;
        }
        var checkAuthLogin = function ($q, $rootScope) {
            var deferred = $q.defer();
            var token = window.localStorage.getItem('accessToken');
            if (token) {
                $rootScope.go('/home')
                deferred.reject()
            } else {
                deferred.resolve()
            }
            return deferred.promise;
        }
        $routeProvider
            .when('/registration', {
                templateUrl: 'template/registration.html',
                controller: 'RegistrationCtrl',
                resolve: {
                    auth: checkAuthLogin,
                    getContent: function () {
                    }
                }
            })

            .when('/login', {
                templateUrl: 'template/login.html',
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

            .when('/confirm/:confirmCode', {
                templateUrl: 'template/confirm.html',
                controller: 'confirmCtrl'
            })

            .when('/home', {
                templateUrl: 'template/home.html',
                controller: 'HomeCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function ($q, $http) {
                        return $q.all({
                            service: $http.get('/get-content', {
                                params: {
                                    name: 'ServiceProvider',
                                    query: {},
                                    distinctName: 'name'
                                }
                            })
                        })
                    }
                }
            })

            .when('/agency', {
                templateUrl: 'template/agency.html',
                controller: 'agencyCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function ($q, $http) {
                        return $q.all({
                            agency: $http.get('/get-agency')
                        })
                    }
                }
            })

            .when('/post-job', {
                templateUrl: 'template/postJob.html',
                controller: 'jobCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function ($q, $http) {
                        return $q.all({
                            contentType: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'ContentWriting', filter: 'Content Type'},
                                    distinctName: 'name'
                                }
                            }),
                            locations: $http.get('/get-content', {
                                params: {
                                    name: 'Location',
                                    query: {},
                                    distinctName: 'name'
                                }
                            })
                        })
                    }
                }
            })

            .when('/post-job/edit/:id', {
                templateUrl: 'template/postJob.html',
                controller: 'jobCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function ($q, $http) {
                        return $q.all({
                            contentType: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'ContentWriting', filter: 'Content Type'},
                                    distinctName: 'name'
                                }
                            }),
                            locations: $http.get('/get-content', {
                                params: {
                                    name: 'Location',
                                    query: {},
                                    distinctName: 'name'
                                }
                            })
                        })
                    }
                }
            })

            .when('/freelancer-registration', {
                templateUrl: 'template/freelanceRegistration.html',
                controller: 'freelancerCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function ($q, $http) {
                        return $q.all({
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
                            locations: $http.get('/get-content', {
                                params: {
                                    name: 'Location',
                                    query: {},
                                    distinctName: 'name'
                                }
                            })
                        })
                    }
                }
            })

            .when('/freelancer/:id', {
                templateUrl: 'template/freelanceRegistration.html',
                controller: 'freelancerCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function ($q, $http) {
                        return $q.all({
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
                            locations: $http.get('/get-content', {
                                params: {
                                    name: 'Location',
                                    query: {},
                                    distinctName: 'name'
                                }
                            })
                        })
                    }
                }
            })

            .when('/contract/create/:id', {
                templateUrl: 'template/contractCreate.html',
                controller: 'contractCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: ['$q', '$http', '$route', function ($q, $http, $route) {
                        return $q.all({
                            contract: $http.get('/contract/create/', {params:{id:$route.current.params.id}})
                        })
                    }]
                }
            })

            .when('/contract/approve/:id', {
                templateUrl: 'template/contractApprove.html',
                controller: 'contractApproveCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: ['$q', '$http', '$route', function ($q, $http, $route) {
                        return $q.all({
                            contract: $http.get('/contract/', {params:{_id:$route.current.params.id}})
                        })
                    }]
                }
            })

            .when('/user', {
                templateUrl: 'template/user.html',
                controller: 'userCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function ($q, $http) {
                        return $q.all({
                            service: $http.get('/get-content', {
                                params: {
                                    name: 'ServiceProvider',
                                    query: {},
                                    distinctName: 'name'
                                }
                            }),
                            topic: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'ContentWriting', filter: 'Industry Expertise'},
                                    distinctName: 'name'
                                }
                            }),
                            user: $http.get('/me')
                        })
                    }
                }
            })

            .when('/category', {
                templateUrl: 'template/category.html',
                controller: 'categoryCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function ($q, $http) {
                        return $q.all({
                            service: $http.get('/get-content', {params: {name: 'ServiceProvider', query: {}, distinctName: 'name'}}),
                            topic: $http.get('/get-content', {params: {name: 'Filters', query: {type: 'ContentWriting', filter: 'Industry Expertise'}, distinctName: 'name'}}),
                            content: $http.get('/get-content', {params: {name: 'Filters', query: {type: 'ContentWriting', filter: 'Content Type'}, distinctName: 'name'}}),
                            languages: $http.get('/get-content', {params: {name: 'Filters', query: {type: 'ContentWriting', filter: 'Languages'}, distinctName: 'name'}}),
                            locations: $http.get('/get-content', {params: {name: 'Location', query: {}, distinctName: 'name'}}),
                            freelancer: $http.get('/freelancer')
                        })
                    }
                }
            })

            .when('/profile/user/:id', {
                templateUrl: 'template/profile.html',
                controller: 'profileCtrl',
                resolve: {
                    auth: checkAuthCtrl
                }
            })

            .when('/view-my-job/Buyer', {
                templateUrl: 'template/viewMyJob.html',
                controller: 'viewMyJobCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function ($q, $http) {
                        return $q.all({
                            service: $http.get('/get-my-job', {params: {name: 'ServiceProvider', query: {}, distinctName: 'name'}}),
                        })
                    }
                }
            })

            .when('/my-profile', {
                templateUrl: 'template/myProfile.html',
                controller: 'myProfileCtrl',
                resolve: {
                    auth: checkAuthCtrl,
                    getContent: function ($q, $http) {
                        return $q.all({
                            user: $http.get('/me')
                        })
                    }
                }
            })


            .otherwise({redirectTo: '/login'});

        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: false
        // });

        $httpProvider.interceptors.push(function ($q, $injector) {
            return {
                'responseError': function (rejection) {
                    if (rejection.status === 402) {
                        var getModalService = function () {
                            if (!modalService)  var modalService = $injector.get('ModalService');
                            return modalService;
                        };
                        var http = $injector.get('$http');
                        getModalService().showModal({
                            templateUrl: "template/modal/modalWindow.html",
                            controller: function ($scope) {
                                $scope.close = function(data){
                                    var http = $injector.get('$http');
                                    function getToken(){
                                        console.log('qqq');
                                        http.get('/refresh-token', {params:{refresh_token: localStorage.getItem('refreshToken')}}).then(
                                            function(resp){
                                                localStorage.setItem('accessToken', resp.data.data.value)
                                            },function(err){
                                                localStorage.clear();
                                                location.reload();
                                            }
                                        )
                                    }
                                    data ? getToken() : (localStorage.clear(),  location.reload());
                                }
                            }
                        }).then(function (modal) {
                            modal.element.modal();
                            modal.close.then(function (result) {
                            });

                        });
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

XYZApp.run(function ($rootScope, $location) {
    $rootScope.go = function (path) {
        $location.path(path)
    }
})