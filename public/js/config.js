angular.module('XYZApp').config(['$routeProvider', '$httpProvider', '$locationProvider',
    function ($routeProvider, $httpProvider, $locationProvider) {
        var authResolve = ["$q", "AuthService", '$rootScope', function ($q, AuthService, $rootScope) {
            var deferred = $q.defer();
            AuthService.checkAuthCtrl().then(function () {
                deferred.resolve();
            }, function () {
                AuthService.showLogin('/');
                deferred.reject();
            });
            return deferred.promise;
        }];
        var getResolve = function (params) {
            return ["$q", function ($q) {
                var deferred = $q.defer();
                deferred.resolve(params);
                return deferred.promise;
            }]
        }
        var getStatic = function (params) {
            return {
                info: getResolve(params)
            }
        }


        $routeProvider

            .when('/', {
                templateUrl: 'template/home.html',
                controller: 'HomeCtrl',
                resolve: {
                    getContent: function ($q, $http) {
                        return $q.all({
                            sellers: $http.get('/api/freelancers', {}),
                            freelancerType: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'FreelancerType'},
                                    distinctName: 'name'
                                }
                            })
                        })
                    }
                }
            })
            .when('/forgot/email', {
                templateUrl: 'template/forgotEmail.html',
                controller: 'forgotCtrl'
            })

            .when('/forgot/restore/:restoreCode', {
                templateUrl: 'template/forgotRestore.html',
                controller: 'forgotCtrl'
            })
            .when('/confirm/:confirmCode', {
                templateUrl: 'template/confirm.html',
                controller: 'confirmCtrl'
            })

            .when('/agencies', {
                templateUrl: 'template/agencies.html',
                controller: 'agencyCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: function ($q, $http) {
                        return $q.all({
                            agencies: $http.get('/api/freelancers'),
                            businessAccounts: $http.get('/api/my/business_accounts')
                        })
                    }
                }
            })

            .when('/post-job/:category?', {
                templateUrl: 'template/postJob.html',
                controller: 'jobCtrl',
                resolve: {
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

            .when('/messages', {
                templateUrl: 'template/chat.html',
                controller: 'chatCtrl'
            })

            .when('/job/:id', {
                templateUrl: 'template/job.html',
                controller: 'jobCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$route', function ($q, $http, $route) {
                        return $q.all({
                            job: $http.get('/api/job/' + $route.current.params.id),
                            apply: $http.get('/api/job-apply/' + $route.current.params.id),
                            stats: $http.get('/api/job-stats/' + $route.current.params.id),
                            contentType: {data: {data: ''}},
                            locations: {data: {data: ''}}
                        })
                    }]
                }
            })

            .when('/job/edit/:id', {
                templateUrl: 'template/editJob.html',
                controller: 'jobCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$route', function ($q, $http, $route) {
                        return $q.all({
                            job: $http.get('/api/job/' + $route.current.params.id),
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
                    }]
                }
            })

            .when('/jobs', {
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: getStatic({
                    template: 'jobs-all',
                    header: 'All jobs',
                    url: '/api/jobs/all'
                })
            })

            .when('/jobs/buyer/open', {
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        template: 'buyer-open',
                        header: 'Open jobs',
                        url: '/api/jobs/buyer/open'
                    })
                }
            })

            .when('/jobs/buyer/ongoing', {
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        template: 'buyer-ongoing',
                        header: 'Ongoing jobs',
                        url: '/api/jobs/buyer/ongoing'
                    })
                }
            })

            .when('/jobs/seller/open', {
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        template: 'seller-open',
                        header: 'Open jobs',
                        url: '/api/jobs/seller/open'
                    })
                }
            })


            .when('/post-job/recreate/:id', {
                templateUrl: 'template/postJob.html',
                controller: 'jobCtrl',
                resolve: {
                    auth: authResolve,
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
                    getContent: function ($q, $http) {
                        return $q.all({
                            industry: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'BloggersAndInfluencers', filter: 'Industry Expertise'},
                                    distinctName: 'name'
                                }
                            }),
                            service: $http.get('/get-content', {
                                params: {
                                    name: 'ServiceProvider',
                                    query: {},
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
                            // clients: $http.get('/get-client')
                        })
                    }
                }
            })

            .when('/freelancer/:id', {
                templateUrl: 'template/freelanceRegistration.html',
                controller: 'freelancerCtrl',
                resolve: {
                    auth: authResolve,
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
                    auth: authResolve,
                    getContent: ['$q', '$http', '$route', function ($q, $http, $route) {
                        return $q.all({
                            contract: $http.get('/contract/create/', {params: {id: $route.current.params.id}})
                        })
                    }]
                }
            })

            .when('/contract/approve/:id', {
                templateUrl: 'template/contractApprove.html',
                controller: 'contractApproveCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$route', function ($q, $http, $route) {
                        return $q.all({
                            contract: $http.get('/contract/', {params: {_id: $route.current.params.id}})
                        })
                    }]
                }
            })

            .when('/contract/suggest/:id', {
                templateUrl: 'template/contractSuggest.html',
                controller: 'contractSuggestCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$route', function ($q, $http, $route) {
                        return $q.all({
                            suggest: $http.get('/suggest', {params: {_id: $route.current.params.id}})
                        })
                    }]
                }
            })

            .when('/contract/close/:id', {
                templateUrl: 'template/contractClose.html',
                controller: 'contractCloseCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$route', function ($q, $http, $route) {
                        return $q.all({
                            job: $http.post('/get-job', {_id: $route.current.params.id})
                        })
                    }]
                }
            })

            .when('/user', {
                templateUrl: 'template/user.html',
                controller: 'userCtrl',
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
                            topic: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'ContentWriting', filter: 'Industry Expertise'},
                                    distinctName: 'name'
                                }
                            }),
                            user: $http.get('/api/user/me')
                        })
                    }
                }
            })

            .when('/category', {
                templateUrl: 'template/category.html',
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
                            topic: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'ContentWriting', filter: 'Industry Expertise'},
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
                            locations: $http.get('/get-content', {
                                params: {
                                    name: 'Location',
                                    query: {},
                                    distinctName: 'name'
                                }
                            }),
                            freelancer: $http.get('/freelancer')
                        })
                    }
                }
            })

            .when('/category/:filter', {
                templateUrl: 'template/category.html',
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
                            topic: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'ContentWriting', filter: 'Industry Expertise'},
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
                            locations: $http.get('/get-content', {
                                params: {
                                    name: 'Location',
                                    query: {},
                                    distinctName: 'name'
                                }
                            }),
                            freelancer: $http.get('/freelancer')
                        })
                    }
                }
            })

            .when('/category/service-provider/:provider', {
                templateUrl: 'template/category.html',
                controller: 'categoryCtrl',
                resolve: {
                    getContent: ['$q', '$http', '$route', function ($q, $http, $route) {
                        return $q.all({
                            topic: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'ContentWriting', filter: 'Industry Expertise'},
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
                            locations: $http.get('/get-content', {
                                params: {
                                    name: 'Location',
                                    query: {},
                                    distinctName: 'name'
                                }
                            }),
                            freelancer: $http.get('/api/freelancers', {params: {freelancer_type: $route.current.params.provider}})
                        })
                    }]
                }
            })

            .when('/profile/user/:id', {
                templateUrl: 'template/profile.html',
                controller: 'profileCtrl',
                resolve: {
                    auth: authResolve
                }
            })


            .when('/profile', {
                templateUrl: 'template/myProfile.html',
                controller: 'myProfileCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: function ($q, $http) {
                        return $q.all({
                            user: $http.get('/api/user/me')
                        })
                    }
                }
            })


            .otherwise({redirectTo: '/'});

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
                                $scope.close = function (data) {
                                    var http = $injector.get('$http');

                                    function getToken() {
                                        console.log('qqq');
                                        http.get('/refresh-token', {params: {refresh_token: localStorage.getItem('refreshToken')}}).then(
                                            function (resp) {
                                                localStorage.setItem('accessToken', resp.data.data.value)
                                            }, function (err) {
                                                localStorage.clear();
                                                location.reload();
                                            }
                                        )
                                    }

                                    data ? getToken() : (localStorage.clear(), location.reload());
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
