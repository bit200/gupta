'use strict';

/* Directives */
XYZCtrls.service('safeApply', function () {
    return {
        run: function ($scope, type) {
            type = type || '$apply'
            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this[type](fn);
                }
            };
        }
    }
});
XYZCtrls.service('parseType', function () {
    return {
        get: function (item, Arr) {
            var arr = [];
            _.forEach(item, function (value, key) {
                _.forEach(Arr, function (el) {
                    if (el.indexOf(key) > -1 && value) {
                        arr.push(el);
                    }
                })
            });
            return arr
        },

        getKey: function (item) {
            var arr = [];
            _.forEach(item, function (value, key) {
                if (value)
                    arr.push(key)
            });
            return arr
        },

        getByNumber: function (item, Arr) {
            var arr = [];
            _.forEach(item, function (value, key) {
                if (value) {
                    arr.push(Arr[key]);
                }
            });
            return arr
        },

        getModel: function (Arr) {
            var arr = [];
            _.forEach(Arr, function (item) {
                arr.push(item.split(' ').shift())

            });
            return arr
        },

        agency: function (item) {
            var arr = [];
            _.forEach(item, function (elem) {
                    var obj = {
                        elem: elem,
                        data: {
                            Logo: elem.logo || null,
                            'Agency Name': elem.name || null,
                            'Service Category': elem.category || null,
                            Address: elem.number_street + ', ' + elem.street + ', ' + elem.city,
                            Status: elem.status || false
                        }
                    };
                    arr.push(obj)
                }
            );
            return arr
        },

        contract: function (item) {
            item.expected_start = new Date(item.expected_start);
            item.expected_completion = new Date(item.expected_completion);
            return item
        },

        openJob: function (jobs, parseTime) {
            var arr = [];
            _.forEach(jobs, function (job) {
                var obj = {
                    elem: job,
                    data: {
                        title: job.title || null,
                        service_provider: job.name || null,
                        response: job.response || null,
                        status: job.status || null,
                        date: parseTime.date(job.created_at) || null
                    }
                };
                arr.push(obj)
            });
            return arr
        }
        ,

        ongoingJob: function (jobs) {
            var arr = [];
            _.forEach(jobs, function (job) {
                var obj = {
                    elem: job,
                    data: {
                        title: job.title || null,
                        service_provider: job.name || null,
                        complection: job.date_of_completion || null,
                        contract_amount: job.contract && job.contract.final_amount || null,
                        pending_amount: job.pending_amount || 0
                    }
                };
                arr.push(obj)
            });
            return arr
        }
        ,

        closedJob: function (jobs) {
            var arr = [];
            _.forEach(jobs, function (job) {
                var obj = {
                    elem: job,
                    data: {
                        title: job.title || null,
                        service_provider: job.name || null,
                        close_job: job.closed_date || null,
                        status: job.status || null,
                        amount: job.disbursed || '-'
                    }
                };
                arr.push(obj)
            });
            return arr
        }

    }
})
;

XYZCtrls.service('parseTime', function () {
    return {
        date: function (date) {
            var today = new Date(date);
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            return (mm + '-' + dd + '-' + yyyy);
        },
        dateTime: function (date) {
            var getTime = new Date(date);
            var dd = getTime.getDate();
            var mm = getTime.getMonth() + 1;
            var yyyy = getTime.getFullYear()
                , h = getTime.getHours()
                , m = getTime.getMinutes()
                , s = getTime.getSeconds();

            if (mm < 10) {
                mm = '0' + mm
            }

            if (m < 10) {
                m = '0' + m
            }

            if (s < 10) {
                s = '0' + s
            }

            var today = new Date();

            if ((today.getTime() - getTime.getTime()) < 1000 * today.getHours() * today.getMinutes() * today.getSeconds()) {
                var time = {
                    time: h + ':' + m + ':' + s
                }
            } else {
                var time = {
                    date: dd + '-' + mm + '-' + yyyy
                };
            }

            return time;
        }
    }
});

// XYZCtrls.service('parseServiceProvider', function () {
//     return {
//         addIcon: function(Arr){
//             var arr = [];
//             _.each(Arr, function(item){
//                 switch (item) {
//                     case 'Content Writing': arr.push({icon:'', text:item});break;
//                     case 'Creative and Ad Making': arr.push({icon:'', text:item});break;
//                     case 'Public Relations': arr.push({icon:'', text:item});break;
//                     case 'Bloggers and Influencers': arr.push({icon:'', text:item});break;
//                     case 'Digital Marketing': arr.push({icon:'', text:item});break;
//                     case 'Branding Services': arr.push({icon:'', text:item});break;
//                     case 'Event Management': arr.push({icon:'', text:item});break;
//                     case 'Direct Marketing': arr.push({icon:'', text:item});break;
//                     case 'Media Planning': arr.push({icon:'', text:item});break;
//                     case 'Media Buying': arr.push({icon:'shopping_cart', text:item});break;
//                 }
//             })
//         }
//     }
// });

XYZCtrls.service('parseRating', function () {
    return {
        popularity: function (value) {
            if (value < 1000) {
                return value
            }
            if (value < 1000000) {
                return value / 1000 + 'k'
            }
            return value / 1000000 + 'm';
        },
        views: function (profiles) {
            profiles = _.each(profiles, function (profile) {
                profile.view = profile.views;
                if (profile.views > 1000 && profile.views < 1000000) {
                    profile.view = (profile.views / 1000).toFixed(0) + 'k';
                }
                if (profile.views > 1000000) {
                    profile.view = (profile.views / 1000000).toFixed(0) + 'm';
                }
            });
            return profiles
        }
    }
});

XYZCtrls.service('payment', ["$http", "AuthService", 'notify', function ($http, AuthService, notify) {
    var user = AuthService.currentUser();
    return function (total, extra_pkg, pkg, contract) {
        var saveParams = {};
        saveParams.amount = total * 100;
        if (pkg) {
            var for_pkg = [];
            for_pkg.push(pkg.title);
            if (extra_pkg)
                _.each(extra_pkg, function (ex) {
                    for_pkg.push(ex.description);
                });
            saveParams.for_pkg = for_pkg;
        }

        if (contract.seller) saveParams.seller = contract.seller._id;
        if (contract.job) saveParams.contract = contract._id;

        var options = {
            "key": "rzp_test_Rwg8wDQEM22Lza",
            "amount": total * 100, // 2000 paise = INR 20
            "name": contract.name,
            "description": contract.description,
            "image": "https://pbs.twimg.com/profile_images/615614376947527680/NZJ6as4r.jpg",
            "handler": function (response) {
                saveParams.payment_id = response.razorpay_payment_id;
                $http.post('/payments/capture', saveParams).success(function (resp) {
                    notify({message: 'You have successfully paid.', duration: 3000, position: 'right', classes: "alert-success"});
                });
            },
            "prefill": {
                "name": user.first_name,
                "email": user.email,
                "contact": user.phone
            },
            "theme": {
                "color": "#808080"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
    }
}]);

XYZCtrls.service('loginSocial', ["$http", "AuthService", '$state', function ($http, AuthService, $state) {
    return function (email, first_name, last_name, preview) {
        var user = {
            email: email,
            preview: preview
        };
        if (first_name) {
            user.first_name = first_name
        }
        if (last_name) {
            user.last_name = last_name
        }

        $http.post('/sign-up-social', user).then(function (resp) {
            // console.log('resp', resp);
            AuthService.setTokens({
                accessToken: resp.data.data.accessToken.value,
                refreshToken: resp.data.data.refreshToken.value
            });
            $state.go('home');
        }, function (err) {
            // console.log('err', err)
        })
    }
}])
XYZCtrls.service('jobParseByStatus', ["$rootScope", 'AuthService', function ($rootScope, AuthService) {
    var jobs = {
        open: [],
        new: [],
        my: [],
        reject: [],
        all: []
    };
    return function (arrayJobs, type) {
        _.each(arrayJobs, function (job) {
            if (["New Applicant", "Contract started", "Rejected by seller", "Rejected by buyer"].indexOf(job.status) > -1) {
                jobs.open.push(job)
            }
            if (["New Applicant"].indexOf(job.status) > -1) {
                jobs.new.push(job)
            }
            if (["New Applicant", "Contract started", "Rejected by seller", "Rejected by buyer"].indexOf(job.status) > -1 && AuthService.userId() == job[type]) {
                jobs.my.push(job)
            }
            if (["Rejected by seller", "Rejected by buyer"].indexOf(job.status) > -1) {
                jobs.reject.push(job)
            }
            if (["open", "ongoing", "close"].indexOf(job.status) > -1) {
                jobs.all.push(job)
            }
        });
        if (type) {
            $rootScope.$emit('job-open', jobs.open);
            $rootScope.$emit('job-new', jobs.new);
            $rootScope.$emit('job-my', jobs.my);
            $rootScope.$emit('job-reject', jobs.reject);
            jobs = {
                open: [],
                new: [],
                my: [],
                reject: [],
                all: []
            };
        } else {
            $rootScope.$emit('job-all', jobs.all);
            jobs = {
                open: [],
                new: [],
                my: [],
                reject: [],
                all: []
            };
        }

    }
}]);
XYZCtrls.service('jobInformation', ["$http", "$rootScope", 'jobParseByStatus', function ($http, $rootScope, jobParseByStatus) {
    var information = {};
    return {
        setInfo: function (obj) {
            if (obj.search)
                information.search = obj.search;
            if (obj.category)
                information.category = obj.category;
            if (obj.location)
                information.location = obj.location;
            if (obj.job_sub_category)
                information.sub_category = obj.sub_category;
            if (obj.budget_min)
                information.budget_min = obj.budget_min;
            if (obj.budget_max)
                information.budget_max = obj.budget_max;
        },
        deleteSearch: function (text) {
            delete information.search;
        },
        getInfo: {
            information: function () {
                return information;
            },
            category: function () {
                return information.category;
            },
            sub_category: function () {
                return information.sub_category;
            }
        }
    };
}]);
XYZCtrls.service('AuthService', ['$q', '$rootScope', 'ModalService', '$http', '$state',
    function ($q, $rootScope, ModalService, $http, $state) {
        var authTokens = {};
        var loggedIn = false, currentUser, currentFreelancer;

        $rootScope.$watch('asView', function (val) {
            if (val) {
                $state.go('dashboard');
                localStorage.setItem('asView', JSON.stringify(val))
            }
        }, true);

        var resObj = {
            setTokens: function (tokens) {
                authTokens = tokens;
                localStorage.setItem('accessToken', tokens.accessToken);
                localStorage.setItem('refreshToken', tokens.refreshToken);
                resObj.setCurrentUser();
                loggedIn = true;
            },
            isLogged: function () {
                return loggedIn
            },
            currentUser: function () {
                return currentUser
            },
            userId: function () {
                return currentUser ? currentUser._id : null
            },
            userName: function () {
                return currentUser.first_name && currentUser.last_name ? [currentUser.first_name, currentUser.last_name].join(' ') : null
            },
            currentFreelancer: function () {
                return currentFreelancer
            },
            logout: function () {
                currentUser = '';
                currentFreelancer = '';
                localStorage.clear();
                loggedIn = false;
                $state.go('home')
            },
            checkAuthCtrl: function () {
                var deferred = $q.defer();
                if (loggedIn) deferred.resolve();
                else {
                    deferred.reject()
                }
                return deferred.promise;
            },
            setCurrentUser: function () {
                var asView = localStorage.getItem('asView');
                $rootScope.asView = asView ? JSON.parse(asView) : {buyer: true};

                $http.get('/api/freelancer/me').success(function (resp) {
                    currentFreelancer = resp
                });
                $http.get('/api/user/me').success(function (resp) {
                    currentUser = resp.data
                });
            }

        };
        if (localStorage.getItem('accessToken')) {
            resObj.setTokens({
                accessToken: localStorage.getItem('accessToken'),
                refreshToken: localStorage.getItem('refreshToken')
            });
            loggedIn = true
        }

        return resObj
    }]);

XYZCtrls.factory('socket', ["socketFactory", '$location', function (socketFactory, $location) {
    var myIoSocket = io.connect('http://' + $location.host() + ':' + $location.port());
    var socket = socketFactory({
        ioSocket: myIoSocket
    });

    return socket;
}]);

XYZCtrls.service('breadCrumbs', function () {
    return {
        returnWay: function (url, user) {
            var way;
            switch (url) {
                case 'dashboard':
                    way = user + '/Dashboard';
                    break;
                case 'root.job_create':
                    way = user + '/Post a Project';
                    break;
                case 'jobs_list.all':
                    way = user + '/View Jobs';
                    break;
                case 'jobs_list.buyer_open':
                    way = 'Buyer/Dashboard/Open Projects';
                    break;
                case 'jobs_list.buyer_ongoing':
                    way = 'Buyer/Dashboard/Ongoing Projects';
                    break;
                case 'jobs_list.buyer_closed':
                    way = 'Buyer/Dashboard/Closed Projects';
                    break;
                case 'jobs_list.seller_open':
                    way = 'Seller/Dashboard/Open Projects';
                    break;
                case 'jobs_list.seller_ongoing':
                    way = 'Seller/Dashboard/Open Projects';
                    break;
                case 'jobs_list.seller_closed':
                    way = 'Seller/Dashboard/Open Projects';
                    break;
                case 'my_profile':
                    way = 'Dashboard/Profile';
                    break;
            }
            return way;
        }
    }
});

var q = ['Post a Project', 'View Jobs', 'View Projects', 'Open Projects', 'Ongoing Projects', 'Closed Projects', 'Dashboard', 'Profile', 'My Profile Details', 'Home', 'Content Writing'
    , 'View Profile', 'Profile Details', '', ''];