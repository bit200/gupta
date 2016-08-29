"use strict";

angular.module('XYZApp').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

        var authResolve = ["$q", "AuthService", "$state", function ($q, AuthService, $state) {
            var deferred = $q.defer();
            AuthService.checkAuthCtrl().then(function () {
                deferred.resolve();
            }, function () {
                $state.go('login')
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
                controller: 'MainCtrl',
                // abstract: true,
                template: '<ui-view></ui-view>'
            })
            .state('home', {
                url: '/',
                templateUrl: 'template/home.html',
                controller: 'HomeCtrl',
                resolve: {
                    getContent: ["$q", "$http", function ($q, $http) {
                        return $q.all({
                            sellers: $http.get('/api/freelancers?page=1&limit=8', {}),
                            locations: $http.get('/get-content', {
                                params: {
                                    name: 'Location',
                                    query: {},
                                    distinctName: 'name'
                                }
                            }),
                            jobs: $http.get('/api/jobs/popular')
                        })
                    }]
                },
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'template/dashboard.html',
                controller: 'DashboardCtrl',
                ncyBreadcrumb: {
                    label: 'Dashboard',
                    labelArr: ['Dashboard'],
                    hideType: false
                }
            })
            .state('forgot_email', {
                url: '/forgot/email',
                templateUrl: 'template/forgotEmail.html',
                controller: 'forgotCtrl',
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })
            .state('login', {
                url: '/signin',
                templateUrl: 'template/login.html',
                controller: 'loginCtrl',
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'template/signup.html',
                controller: 'signupCtrl',
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })
            .state('forgot_restore', {
                url: '/forgot/restore/:restoreCode',
                templateUrl: 'template/forgotRestore.html',
                controller: 'forgotCtrl',
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })
            .state('confirm', {
                url: '/confirm/:confirmCode',
                templateUrl: 'template/confirm.html',
                controller: 'confirmCtrl',
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })

            .state('agencies', {
                url: '/agencies?page',
                templateUrl: 'template/claim_agencies.html',
                controller: 'AgencyCtrl',
                reloadOnSearch: false,
                resolve: {
                    getContent: ["$q", "$http", "$location", function ($q, $http, $location) {
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
                    }]
                },
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })

            .state('messages', {
                url: '/messages',
                templateUrl: 'template/chat.html',
                controller: 'chatCtrl',
                resolve: {
                    getContent: ["$q", "$http", function ($q, $http) {
                        return $q.all({
                            rooms: $http.get('/api/chat/rooms')
                        })
                    }]
                },
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })

            .state('me', {
                url: '/me',
                templateUrl: 'template/me.html',
                controller: ['info', '$scope', function (info, scope) {
                    scope.info = info
                }],
                resolve: {
                    info: ["$q", "$http", function ($q, $http) {
                        return $q.all({
                            info: $http.get('/api/me')
                        })
                    }]
                },
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })

            .state('jobs_list', {
                url: '/projects',
                templateUrl: 'js/directives/jobs-list/jobs-content.html',
                controller: 'JobsContentCtrl',
                abstract: false,
                resolve: {
                    getContent: ["$http", function($http){
                        return $http.get('/get-content', {
                                            params: {
                                                name: 'Filters',
                                                query: {type: 'Content and Translation'},
                                                distinctName: 'name'
                                            }
                                        })
                    }]
                },
                ncyBreadcrumb: {
                    label: 'Dashboard',
                    labelArr: ['Dashboard'],
                    hideType: false,
                    hideElem: true
                }
            })
            .state('jobs_list.all', {
                url: '/',
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve:
                    getStatic({
                    template: 'jobs-all',
                        header: 'All jobs',
                    url: '/api/jobs/all',
                    info: getResolve({
                        user_type: 'buyer',
                        job_type: 'open',
                        page_type: 'all'
                    }),
                    getContent: function ($q, $http) {
                        return $q.all({
                            content: $http.get('/get-content', {params: {name: 'Filters', query: {type: 'Content and Translation'}, distinctName: 'name'}}),
                        })
                    }
                }),
                ncyBreadcrumb: {
                    label: 'View Projects',
                    labelArr: ['Find Projects'],
                    hideType: false
                }
            })
            .state('how_it_work', {
                url: '/how_it_work',
                templateUrl: 'template/home.html',
                controller: 'HomeCtrl',
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                },
                data: {
                    how_it_work: true
                },
                resolve: {
                    getContent: ["$q", "$http", function ($q, $http) {
                        return $q.all({ 
                            sellers: $http.get('/api/freelancers?page=1&limit=8', {}),
                            locations: $http.get('/get-content', {
                                params: {
                                    name: 'Location',
                                    query: {},
                                    distinctName: 'name'
                                }
                            }),
                            jobs: $http.get('/api/jobs/popular')
                        })
                    }]
                },
            })
            .state('jobs_list.buyer_my', {
                url: '/buyer/my',
                templateUrl: 'template/viewMyJob.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        user_type: 'buyer',
                        job_type: 'my',
                        page_type: 'buyer_my'
                    }),
                    getContent: function () {
                    }
                },
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })
            .state('jobs_list.buyer_open', {
                url: '/buyer/open',
                templateUrl: 'template/jobs/jobs_buyer_open.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        user_type: 'buyer',
                        job_type: 'open',
                        page_type: 'buyer_open'

                    }),
                    getContent: ["$q", "$http", function ($q, $http) {
                        return $q.all({
                            content: $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'Content and Translation'},
                                    distinctName: 'name'
                                }
                            }),
                            a: 'buyer'
                        })
                    }],
                    s: getResolve({
                        user_type: 'buyer',
                        job_type: 'open',

                    }),
                },
                ncyBreadcrumb: {
                    label: 'Open Projects',
                    labelArr: ['Dashboard', '/', 'Open Projects'],
                    hideType: false
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
                        job_type: 'ongoing',
                        page_type: 'buyer_ongoing'
                    }),
                    getContent: function () {
                    }
                },
                ncyBreadcrumb: {
                    label: 'Ongoing Projects',
                    labelArr: ['Dashboard', '/', 'Ongoing Projects'],
                    hideType: false
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
                        job_type: 'closed',
                        page_type: 'buyer_close'
                    }),
                    getContent: function () {
                    }
                },
                ncyBreadcrumb: {
                    label: 'Closed Projects',
                    labelArr: ['Dashboard', '/', 'Closed Projects'],
                    hideType: true
                }
            })

            .state('jobs_list.seller_open', {
                url: '/seller/open',
                templateUrl: 'template/jobs/jobs_seller_open.html',
                controller: 'ViewMyJobCtrl',
                resolve: {
                    auth: authResolve,
                    info: getResolve({
                        user_type: 'seller',
                        job_type: 'open',
                        page_type: 'seller_open'
                    }),
                    getContent: function () {
                    },
                    s: getResolve({
                        user_type: 'seller',
                        job_type: 'open',

                    }),
                },
                ncyBreadcrumb: {
                    label: 'Open Projects',
                    labelArr: ['Dashboard', '/', 'Open Projects'],
                    hideType: false
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
                        job_type: 'ongoing',
                        page_type: 'seller_ongoing'
                    }),
                    getContent: function () {
                    }
                },
                ncyBreadcrumb: {
                    label: 'Ongoing Projects',
                    labelArr: ['Dashboard', '/', 'Ongoing Projects'],
                    hideType: false
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
                        job_type: 'closed',
                        page_type: 'seller_close'
                    }),
                    getContent: function () {
                    }
                },
                ncyBreadcrumb: {
                    label: 'Closed Projects',
                    labelArr: ['Dashboard', '/', 'Closed Projects'],
                    hideType: false
                }
            })

            .state('freelancer_registration', {
                url: '/freelancer-registration',
                templateUrl: 'template/freelancer_registration/freelancer_registration.html',
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })

            .state('freelancer_id', {
                url: '/freelancer/:id',
                templateUrl: 'template/freelanceRegistration.html',
                controller: 'freelancerCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ["$q", "$http", function ($q, $http) {
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
                                    query: {type: 'Content and Translation'},
                                    distinctName: 'name'
                                }
                            }),
                            languages: $http.get('/get-content', {
                                params: {
                                    name: 'Languages',
                                    query: {},
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
                    }]
                },
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })

            .state('user', {
                url: '/user',
                templateUrl: 'template/user.html',
                controller: 'userCtrl',
                resolve: {
                    auth: authResolve,
                    getContent: ["$q", "$http", function ($q, $http) {
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
                                    query: {type: 'Content and Translation'},
                                    distinctName: 'name'
                                }
                            }),
                            user: $http.get('/api/user/me')
                        })
                    }]
                },
                ncyBreadcrumb: {
                    label: ' ',
                    hideType: true
                }
            })
            .state('category', {
                url: '/categories',
                templateUrl: 'template/category.html',
                controller: 'CategoriesCtrl',
                reloadOnSearch: false,
                ncyBreadcrumb: {
                    label: '  ',
                    labelArr: ['Home', '/', 'View profile'],
                    hideType: true
                },
                resolve: {
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http) {
                        return $q.all({
                            languages: $http.get('/get-content', {
                                params: {
                                    name: 'Languages',
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
                    }]
                }
            })

            .state('categories', {
                url: '/categories/:type/:filter',
                templateUrl: 'template/category.html',
                controller: 'CategoriesCtrl',
                reloadOnSearch: false,
                ncyBreadcrumb: {
                    label: '  ',
                    labelArr: ['Home', '/', 'View profile'],
                    hideType: true
                },
                resolve: {
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http) {
                        return $q.all({
                            languages: $http.get('/get-content', {
                                params: {
                                    name: 'Languages',
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
                    }]
                }
            })
            .state('view_projects', {
                url: '/view_projects?city',
                templateUrl: 'template/view_projects.html',
                controller: 'ViewProjectsCtrl',
                reloadOnSearch: false,
                ncyBreadcrumb: {
                    label: ' ',
                    labelArr: ['Home', '/', 'View projects'],
                    hideType: true
                },
                resolve: {
                    getContent: ['$q', '$http', '$stateParams', function ($q, $http) {
                        return $q.all({
                            languages: $http.get('/get-content', {
                                params: {
                                    name: 'Languages',
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
                    getContent: ["$q", "$http", "$stateParams", function ($q, $http, $stateParams) {
                        return $q.all({
                            viewsCount: $http.get('/api/freelancer/' + $stateParams.id + '/views?days=90'),
                            profile: $http.get('/api/freelancer/' + $stateParams.id),
                        })
                    }]
                },
                ncyBreadcrumb: {
                    label: ' ',
                    labelArr: ['Home', '/', 'View profile', '/', 'Profile Details'],
                    hideType: false
                }
            })

            .state('profile', {
                url: '/profile/:id',
                views: {
                    "@": {
                        controller: 'ViewProfileCtrl',
                        templateUrl: 'template/profile.html'
                    }
                },
                resolve: {
                    getContent: ["$q", "$http", "$stateParams", function ($q, $http, $stateParams) {
                        return $q.all({
                            viewsCount: $http.get('/api/freelancer/' + $stateParams.id + '/views?days=90'),
                            profile: $http.get('/api/freelancer/' + $stateParams.id)
                        })
                    }]
                },
                ncyBreadcrumb: {
                    label: '  ',
                    labelArr: ['Home', '/', 'View profile', '/', 'Profile Details'],
                    hideType: true
                }
            })

            .state('my_profile', {
                url: '/my_profile',
                templateUrl: 'template/my_profile.html',
                controller: 'myProfileCtrl',
                resolve: {
                    auth: authResolve
                },
                ncyBreadcrumb: {
                    label: ' ',
                    labelArr: ['Dashboard', '/', 'Profile'],
                    hideType: false
                }
            })

            .state('favorite', {
                url: '/favorite',
                templateUrl: 'template/favorite.html',
                controller: 'favoriteCtrl',
                resolve: {
                    auth: authResolve
                }
            })

            .state('About', {
                    url: '/about',
                    template: '<h3 class="text-center" style="margin-top: 135px;">About template</h3>',
                })

            .state('Testimonial', {
                    url: '/testimonial',
                    template: '<h3 class="text-center" style="margin-top: 135px;">Testimonial template</h3>',
                })

            .state('Show to list', {
                    url: '/show_to_list',
                    template: '<h3 class="text-center" style="margin-top: 135px;">Show to list template</h3>'
                })

            // .state('How it works', {
            //         url: '/how_it_works',
            //         template: '<h3 class="text-center" style="margin-top: 135px;">How it works template</h3>',
            //     })

            .state('Clients', {
                    url: '/clients',
                    template: '<h3 class="text-center" style="margin-top: 135px;">Clients template</h3>'
                })

            .state('Terms & Conditions', {
                    url: '/terms_Conditions',
                    template: '<h3 class="text-center" style="margin-top: 135px;">Terms & Conditions template</h3>'
                })

            .state('Press', {
                    url: '/press',
                    template: '<h3 class="text-center" style="margin-top: 135px;">Press template</h3>'
                })

            .state('contact.buyer', {
                    url: '/contact/:type',
                    template: '<h3 class="text-center" style="margin-top: 135px;">Contact template</h3>'
                })
            .state('contact.seller', {
                    url: '/contact/:type',
                    template: '<h3 class="text-center" style="margin-top: 135px;">Contact template</h3>'
                });


        _states('root.contract_create', '/contract/create/:job/:freelancer', 'contractCtrl', ['job', 'freelancer'], '', true);
        _states('root.contract_close', '/contract/close/:contract', 'contractCtrl', ['contract'], '', true);
        _states('root.contract_detailed', '/contract/:contract', 'contractCtrl', ['contract'], '', true);
        _states('root.contract_edit', '/contract/edit/:contract', 'contractCtrl', ['contract'], '', true);
        _states('root.contract_edit_terms', '/contract/edit-terms/:contract', 'contractCtrl', ['contract'], '', true);
        _states('root.contract_mark_complete', '/contract/mark-complete/:contract', 'contractCtrl', ['contract'], '', true);

        _states('root.contract_suggest_detailed', '/suggestion/:suggest', 'contractCtrl', ['suggest'], '', true);
        _states('root.contract_suggest', '/contract/suggest/:contract', 'contractCtrl', ['contract'], '', true);
        _states('root.contract_pause', '/contract/pause/:contract', 'contractCtrl', ['contract'], '', true);
        _states('root.contract_resume', '/contract/resume/:contract', 'contractCtrl', ['contract'], '', true);
        _states('root.contract_reject', '/contract/reject/:contract', 'contractCtrl', ['contract'], '', true);
        _states('root.contract_approve', '/contract/approve/:contract', 'contractCtrl', ['contract'], '', true);
        _states('root.contract_accept', '/contract/accept/:contract', 'contractCtrl', ['contract'], '', true);
        _states('root.contract_initial_payment', '/contract/initial-payment/:contract', 'contractCtrl', ['contract'], '', true);


        _states('root.job_create', '/post-project', 'jobCtrl', ['contentType', 'locations'], '', false, ['Post a Project']);
        _states('root.job_recreate', '/job/recreate/:job', 'jobCtrl', ['job', 'contentType', 'locations'], '', true);
        _states('root.job_detailed', '/job/:job', 'jobCtrl', ['job', 'stats', 'apply'], '*', true);
        _states('root.job_edit', '/job/edit/:job', 'jobCtrl', ['job', 'contentType', 'locations'], '', true);


        _states('root.apply_create', '/job/apply/:job', 'jobCtrl', ['job', 'apply'], '', true);
        _states('root.apply_edit', '/job/apply/edit/:job', 'jobCtrl', ['job', 'apply'], '', true);
        _states('root.apply_detailed', '/application/:apply', 'jobCtrl', ['apply_by_id'], '*', true);


        function common_q_all(state_child_name, resolves_arr) {
            return ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {
                var info_obj = {}
                    , t = {};
                info_obj[state_child_name] = true;

                var get_fn = function (name) {
                    switch (name) {
                        case 'job':
                            return $http.get('/api/job/detailed/' + $stateParams.job);
                        case 'apply':
                            return $http.get('/api/job-apply/' + $stateParams.job);
                        case 'suggest':
                            return $http.get('/api/suggest/', {params: {suggest: $stateParams.suggest}});
                        case 'apply_by_id':
                            return $http.get('/api/job-apply/' + $stateParams.apply + '/pub');
                        case 'freelancer':
                            return $http.get('/api/info/Freelancer/' + $stateParams.freelancer);
                        case 'stats':
                            return $http.get('/api/job-stats/' + $stateParams.job);
                        case 'user':
                            return $http.get('/api/user/me');
                        case 'contract':
                            return $http.get('/api/contract/detailed/' + $stateParams.contract);
                        case 'contentType':
                            return $http.get('/get-content', {
                                params: {
                                    name: 'Filters',
                                    query: {type: 'Content and Translation'},
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

                _.each(resolves_arr, function (name) {
                    var fn = get_fn(name)
                    if (fn) {
                        t[name] = fn
                    } else {
                    }
                })
                t.i = getResolveQ($q, info_obj)

                return $q.all(t)
            }]
        }


        function _states(state_name, url, ctrl, resolves_arr, is_free_auth, hideType, label) {
            var state_arr = state_name.split('.')
                , state_child_name = state_arr[1] || state_arr[0]

            _state_obj[state_name] = {
                url: url,
                name: state_name
            };
            var state_obj = {
                url: url,
                templateUrl: 'template/jobs/' + state_child_name + '.html',
                controller: ctrl,
                resolve: is_free_auth ? {
                    getContent: common_q_all(state_child_name, resolves_arr)
                } : {
                    auth: authResolve,
                    getContent: common_q_all(state_child_name, resolves_arr)
                },
                ncyBreadcrumb: {
                    label: ' ',
                    labelArr: label,
                    hideType: hideType
                }
            };

            $stateProvider.state(state_name, state_obj);
        }


        $urlRouterProvider.otherwise('/#/');

    
        var modalService, openedModal;
        $httpProvider.interceptors.push(["$q", "$injector", function ($q, $injector) {
            return {
                'responseError': function (rejection) {
                    if (rejection.status === 402) {

                        var getModalService = function () {
                            if (!modalService)  modalService = $injector.get('ModalService');
                            return modalService;
                        };
                        if (!openedModal) {
                            openedModal = true;
                            getModalService().showModal({
                                templateUrl: "template/modal/sessionExpireWindow.html",
                                controller: function ($scope) {
                                    $scope.close = function (data) {
                                        var http = $injector.get('$http');

                                        function getToken() {
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
                                    openedModal = false;
                                });

                            });
                        }
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
        }]);
    }
]);
