// angular.module('XYZApp').config(['$stateParamsProvider', '$httpProvider', '$locationProvider',
//     function ($stateParamsProvider, $httpProvider, $locationProvider) {
angular.module('XYZApp').config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider) {
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
        var getResolveQ = function($q, params) {
            var deferred = $q.defer();
            deferred.resolve(params);
            return deferred.promise;
        }

        var getResolve = function (params) {
            return ["$q", function ($q) {
                var deferred = $q.defer();
                deferred.resolve(params);
                return deferred.promise;
            }]
        };
        
        var getStatic = function (params) {
            return {
                info: getResolve(params)
            }
        };


        $stateProvider
            .state('home', {
                url: '/',
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
                            }),
                            jobs: $http.get('/api/jobs/all')
                        })
                    }
                }
            })
            .state('forgot_email', {
                url: '/forgot/email',
                templateUrl: 'template/forgotEmail.html',
                controller: 'forgotCtrl'
            })

            .state('forgot_restore', {
                url: '/forgot/restore/:restoreCode',
                templateUrl: 'template/forgotRestore.html',
                controller: 'forgotCtrl'
            })
            .state('confirm', {
                url: '/confirm/:confirmCode',
                templateUrl: 'template/confirm.html',
                controller: 'confirmCtrl'
            })

            .state('agencies', {
                url: '/agencies',
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

            .state('messages', {
                url: '/messages',
                templateUrl: 'template/chat.html',
                controller: 'chatCtrl'
            })

            .state('job', {
                url: '/job/:id',
                templateUrl: 'template/job.html',
                controller: 'jobCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            job: $http.get('/api/job/' + $stateParams.id),
                            apply: $http.get('/api/job-apply/' + $stateParams.id),
                            stats: $http.get('/api/job-stats/' + $stateParams.id),
                            contentType: {data: {data: ''}},
                            locations: {data: {data: ''}}
                        })
                    }]
                }
            })

            .state('job_apply', {
                url: '/job/apply/:id',
                templateUrl: 'template/applyForJob.html',
                controller: 'jobCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            job: $http.get('/api/job/' + $stateParams.id),
                            apply: $http.get('/api/job-apply/' + $stateParams.id),
                            contentType: {data: {data: ''}},
                            locations: {data: {data: ''}}
                        })
                    }]
                }
            })
            .state('job_apply_detailed', {
                url: '/application/:id',
                templateUrl: 'template/applicationDetails.html',
                controller: 'commonCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            apply: $http.get('/api/job-apply/' + $stateParams.id + '/pub'),
                        })
                    }]
                }
            })
            
            .state('job_post', {
                url: '/post-job/:category?',
                templateUrl: 'template/postJob.html',
                controller: 'postJobCtrl',
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

            .state('job_edit', {
                url: '/job/edit/:id',
                templateUrl: 'template/editJob.html',
                controller: 'postJobCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            job: $http.get('/api/job/' + $stateParams.id),
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

            .state('job_recreate', {
                url: '/post-job/recreate/:id',
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



            .state('me', {
                url: '/me',
                templateUrl: 'template/me.html',
                controller: ['info', '$scope', function(info, scope) {
                    scope.info = info
                }],
                resolve: {
                    info: function ($q, $http) {
                        return $q.all({
                            info: $http.get('/api/me')
                        })
                    }
                }
            })
            .state('jobs', {
                url: '/jobs',
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: getStatic({
                    template: 'jobs-all',
                    header: 'All jobs',
                    url: '/api/jobs/all'
                })
            })
            .state('jobs_buyer_my', {
                url: '/jobs/buyer/my',
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        user_type: 'buyer',
                        job_type: 'my'
                    })
                }
            })
            .state('jobs_buyer_open', {
                url: '/jobs/buyer/open',
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        user_type: 'buyer',
                        job_type: 'open'
                    })
                }
            })

            .state('jobs_buyer_ongoing', {
                url: '/jobs/buyer/ongoing',
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        user_type: 'buyer',
                        job_type: 'ongoing'
                    })
                }
            })
            .state('jobs_buyer_closed', {
                url: '/jobs/buyer/closed',
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        user_type: 'buyer',
                        job_type: 'closed'
                    })
                }
            })

            .state('jobs_seller_open', {
                url: '/jobs/seller/open',
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        user_type: 'seller',
                        job_type: 'open'
                    })
                }
            })
            .state('jobs_seller_ongoing', {
                url: '/jobs/seller/ongoing',
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        user_type: 'seller',
                        job_type: 'ongoing'
                    })
                }
            })
            .state('jobs_seller_closed', {
                url: '/jobs/seller/closed',
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        user_type: 'seller',
                        job_type: 'closed'
                    })
                }
            })


            .state('freelancer_registration', {
                url: '/freelancer-registration',
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

            .state('freelancer_id', {
                url: '/freelancer/:id',
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
            .state('contract_create_job_freelancer', {
                url: '/contract/create/:job/:freelancer',
                templateUrl: 'template/contractCreate.html',
                controller: 'contractCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            job: $http.get('/api/info/Job/'+ $stateParams.job),
                            freelancer: $http.get('/api/info/Freelancer/'+ $stateParams.freelancer),
                            user: $http.get('/api/user/me')
                        })
                    }]
                }
            })
            .state('contract_edit', {
                url: '/contract/edit/:id',
                templateUrl: 'template/contractCreate.html',
                controller: 'contractCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            contract: $http.get('/api/contract/detailed/'+ $stateParams.id)
                        })
                    }]
                }
            })
            .state('contract_detailed', {
                url: '/contract/:id',
                templateUrl: 'template/contractDetails.html',
                controller: 'contractCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            contract: $http.get('/api/contract/detailed/'+ $stateParams.id)
                        })
                    }]
                }
            })

            .state('contract_create', {
                url: '/contract/create/:id',
                templateUrl: 'template/contractCreate.html',
                controller: 'contractCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            contract: $http.get('/contract/create/', {params: {id: $stateParams.id}})
                        })
                    }]
                }
            })

            .state('contract_approve', {
                url: '/contract/approve/:id',
                templateUrl: 'template/contractDetails.html',
                controller: 'contractCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            contract: $http.get('/api/contract/detailed/'+ $stateParams.id),
                            info: getResolveQ($q, {
                                is_approve_page: true,
                                from_seller: true,
                                from_buyer: true
                            })
                        })
                    }]
                }
            })

            .state('contract_suggest_to_buyer', {
                url: '/contract/suggest-edits-to-buyer/:id',
                templateUrl: 'template/contractCreate.html',
                controller: 'contractCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            contract: $http.get('/api/contract/suggest/detailed/'+ $stateParams.id, {
                                params: {
                                    to_buyer: true
                                }
                            }),
                            info: getResolveQ($q,{
                                is_suggest_page: true,
                                to_buyer: true
                            })
                        })
                    }]
                }
            })
            .state('contract_suggest_to_seller', {
                url: '/contract/suggest-edits-to-seller/:id',
                templateUrl: 'template/contractCreate.html',
                controller: 'contractCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            contract: $http.get('/api/contract/sugest/detailed/'+ $stateParams.id, {params: {
                                to_seller: true
                            }}),
                            info: getResolveQ($q, {
                                is_suggest_page: true,
                                to_seller: true
                            })
                        })
                    }]
                }
            })
            .state('contract_close', {
                url: '/contract/close/:id',
                templateUrl: 'template/contractClose.html',
                controller: 'contractCloseCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            job: $http.post('/get-job', {_id: $stateParams.id})
                        })
                    }]
                }
            })

            .state('user', {
                url: '/user',
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
            .state('category', {
                url: '/category',
                templateUrl: 'template/category.html',
                controller: 'categoryCtrl',
                reloadOnSearch: false,
                resolve: {
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
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
                            arrayProviders: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'FreelancerType'},
                                    distinctName: 'name'
                                }
                            })
                        })
                    }]
                }
            })

            .state('profile_user', {
                url: '/profile/user/:id',
                templateUrl: 'template/profile.html',
                controller: 'profileCtrl',
                resolve: {
                    auth: authResolve
                }
            })


            .state('/profile', {
                url: '/profile',
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


        $urlRouterProvider.otherwise('/');

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
