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
        var getResolveQ = function ($q, params) {
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
            .state('root', {
                url: '',
                abstract: true,
                template: '<ui-view></ui-view>'
            })

            .state('contract_suggest_detailed', {
                url: '/suggestion/:id',
                templateUrl: 'template/jobs/contract_detailed.html',
                controller: 'contractCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                        return $q.all({
                            contract: $http.get('/api/contract/detailed/' + $stateParams.id),
                            i: getResolveQ($q, {
                                contract_suggest_detailed: true
                            })
                        })
                    }]
                }
            })

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
                                    name: 'ServiceProvider',
                                    query: {},
                                    distinctName: 'name'
                                }
                            }),
                            jobs: $http.get('/api/jobs/popular')
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
                url: '/agencies?page',
                templateUrl: 'template/claim_agencies.html',
                controller: 'AgencyCtrl',
                reloadOnSearch: false,
                resolve: {
                    getContent: function ($q, $http, $location) {
                        return $q.all({
                             locations: $http.get('/get-content', {
                                 params: {
                                     name: 'Location',
                                     query: {},
                                     distinctName: 'name'
                                 }
                             }),
                            totalCount: $http.get('/api/freelancers?count=true'),
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

            .state('me', {
                url: '/me',
                templateUrl: 'template/me.html',
                controller: ['info', '$scope', function (info, scope) {
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

            .state('jobs_list', {
                url: '/jobs',
                templateUrl: 'js/directives/jobs-list/jobs-content.html',
                abstract: true
            })
            .state('jobs_list.all', {
                url: '',
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: getStatic({
                    template: 'jobs-all',
                    header: 'All jobs',
                    url: '/api/jobs/all'
                })
            })
            .state('jobs_list.buyer_my', {
                url: '/buyer/my',
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
            .state('jobs_list.buyer_open', {
                url: '/buyer/open',
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

            .state('jobs_list.buyer_ongoing', {
                url: '/buyer/ongoing',
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
            .state('jobs_list.buyer_closed', {
                url: '/buyer/closed',
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

            .state('jobs_list.seller_open', {
                url: '/seller/open',
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
            .state('jobs_list.seller_ongoing', {
                url: '/seller/ongoing',
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
            .state('jobs_list.seller_closed', {
                url: '/seller/closed',
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
                templateUrl: 'template/freelancer_registration/freelancer_registration.html',
                // controller: 'FreelancerRegistrationCtrl',
                // resolve: {
                //     getContent: function ($q, $http) {
                //         return $q.all({
                //             industry: $http.get('/get-content', {
                //                 params: {
                //                     name: 'Filters',
                //                     query: {type: 'BloggersAndInfluencers', filter: 'Industry Expertise'},
                //                     distinctName: 'name'
                //                 }
                //             }),
                //             service: $http.get('/get-content', {
                //                 params: {
                //                     name: 'ServiceProvider',
                //                     query: {},
                //                     distinctName: 'name'
                //                 }
                //             }),
                //             content: $http.get('/get-content', {
                //                 params: {
                //                     name: 'Filters',
                //                     query: {type: 'ContentWriting', filter: 'Content Type'},
                //                     distinctName: 'name'
                //                 }
                //             }),
                //             languages: $http.get('/get-content', {
                //                 params: {
                //                     name: 'Filters',
                //                     query: {type: 'ContentWriting', filter: 'Languages'},
                //                     distinctName: 'name'
                //                 }
                //             }),
                //             freelancerType: $http.get('/get-content', {
                //                 params: {
                //                     name: 'ServiceProvider',
                //                     query: {},
                //                     distinctName: 'name'
                //                 }
                //             }),
                //             locations: $http.get('/get-content', {
                //                 params: {
                //                     name: 'Location',
                //                     query: {},
                //                     distinctName: 'name'
                //                 }
                //             })
                //             // clients: $http.get('/get-client')
                //         })
                //     }
                // }
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
                            })
                        })
                    }
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
            .state('categories', {
                url: '/categories',
                templateUrl: 'template/category.html',
                controller: 'CategoriesCtrl',
                reloadOnSearch: false,
                resolve: {
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http) {
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
                                    name: 'ServiceProvider',
                                    query: {},
                                    distinctName: 'name'
                                }
                            })
                        })
                    }]
                }
            })
            .state('categories.profile', {
                url: '/profile/:id',
                views: {
                    "@": {
                        controller: 'ViewProfileCtrl',
                        templateUrl: 'template/profile.html'
                    }
                },
                resolve: {
                    getContent: function ($q, $http, $stateParams) {
                        return $q.all({
                            viewsCount: $http.get('/api/freelancer/' + $stateParams.id + '/views?days=90'),
                            profile: $http.get('/api/freelancer/' + $stateParams.id)
                        })
                    }
                }
            })

            .state('my_profile', {
                url: '/my_profile',
                templateUrl: 'template/my_profile.html',
                resolve: {
                    auth: authResolve
                }
            });

        _states('root.contract_create', '/contract/create/:job/:freelancer', 'contractCtrl', ['job', 'freelancer'])

        // _states('root.contract_detailed', c_fn('/contract/:id', 'contract_detailed'))
        //
        // _states('root.contract_create', common_fn('/contract/create/:job/:freelancer'), 'contractCtrl')
        // _states('root.contract_edit', c_fn('/contract/edit/:id', 'contract_create'))
        // _states('root.contract_suggest', c_fn('/contract/suggest/:id', 'contract_create'))
        // _states('root.contract_pause', c_fn('/contract/pause/:id', 'contract_create'))
        // _states('root.contract_resume', c_fn('/contract/resume/:id', 'contract_create'))
        // _states('root.contract_approve', c_fn('/contract/approve/:id', 'contract_create'))
        // _states('root.contract_accept', c_fn('/contract/accept/:id', 'contract_create'))

        _states('root.job_create', '/post-job', 'jobCtrl', ['contentType', 'locations'])
        _states('root.job_recreate', '/job/recreate/:job', 'jobCtrl', ['job', 'contentType', 'locations'])
        _states('root.job_detailed', '/job/:job', 'jobCtrl', ['job', 'stats', 'apply'], '*')
        _states('root.job_edit', '/job/edit/:job', 'jobCtrl', ['job', 'contentType', 'locations'])


        _states('root.apply_create', '/job/apply/:job', ['job', 'apply'])
        _states('root.apply_edit', '/job/apply/edit/:job', ['job', 'apply'])
        _states('root.apply_detailed', '/application/:apply', ['apply'])


        function common_q_all(state_child_name, resolves_arr) {
            return ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                var info_obj = {}
                    , t = {}
                info_obj[state_child_name] = true

                var get_fn = function (name) {
                    switch (name) {
                        case 'job':
                            return $http.get('/api/job/detailed/' + $stateParams.job)
                        case 'apply':
                            return $http.get('/api/job-apply/' + $stateParams.job)
                        case 'freelancer':
                            return $http.get('/api/info/Freelancer/' + $stateParams.freelancer)
                        case 'stats':
                            return $http.get('/api/job-stats/' + $stateParams.job)
                        case 'user':
                            return $http.get('/api/user/me')
                        case 'contract':
                            return $http.get('/api/contract/detailed/' + $stateParams.contract)
                        case 'contentType':
                            return $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'ContentWriting', filter: 'Content Type'},
                                    distinctName: 'name'
                                }
                            })
                        case 'locations':
                            return $http.get('/get-content', {
                                params: {
                                    name: 'Location',
                                    query: {},
                                    distinctName: 'name'
                                }
                            })
                        default:
                            return null
                    }
                }

                _.each(resolves_arr, function(name){
                    var fn = get_fn(name)
                    if (fn) {
                        t[name] = fn
                    } else {
                        console.log("@@ STATE NOT FOUNDDDDDD !!!!! ERRROR !!!! ERRROR", name)
                    }
                })
                t.i = getResolveQ($q, info_obj)
                console.log('@@@ tttttttt', resolves_arr, t)

                return $q.all(t)
            }]
        }



        function _states (state_name, url, ctrl, resolves_arr, is_free_auth) {
            var state_arr = state_name.split('.')
                , state_child_name = state_arr[1] || state_arr[0]

            var state_obj = {
                url: url,
                templateUrl: 'template/jobs/' + state_child_name + '.html',
                controller: ctrl,
                resolve: is_free_auth ? {
                    getContent: common_q_all(state_child_name, resolves_arr)
                } : {
                    auth: authResolve,
                    getContent: common_q_all(state_child_name, resolves_arr)
                }
            }

            $stateProvider.state(state_name, state_obj);
        }



        $urlRouterProvider.otherwise('/');


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
