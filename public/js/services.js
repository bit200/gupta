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
        }
        ,

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
        }
    }
})

XYZCtrls.service('parseRating', function () {
    return {
        rating: function (Arr) {
            _.forEach(Arr, function (item) {
                var arr = [0, 0, 0, 0, 0];
                if (item.rating > 5)
                    item.rating = 5;
                for (var i = 0; i < item.rating; i++) {
                    arr[i] = 1;
                }
                item.ratingArr = arr;
            });
            return Arr;
        },
        popularity: function (Arr) {
            _.forEach(Arr, function (item) {
                var arr = [0, 0, 0, 0];
                if (item.popularity > 4) {
                    item.popularity = 4;
                }
                for (var i = 0; i < item.popularity; i++) {
                    arr[i] = 1;
                }
                item.popularityArr = arr;
            });
            return Arr;
        }
    }
});

XYZCtrls.service('AuthService', [ '$q', '$rootScope', 'ModalService', '$http', '$location',
        function($q, $rootScope, ModalService, $http, $location){
            var authTokens = {};
            var loggedIn = false;

            if (localStorage.getItem('accessToken')){
                authTokens = {
                    accessToken: localStorage.getItem('accessToken'),
                    refreshToken: localStorage.getItem('refreshToken')
                };
                loggedIn = true
            }
            var self = this;
            var resObj = {
                setTokens: function(tokens){
                    authTokens = tokens;
                    localStorage.setItem('accessToken', tokens.accessToken);
                    localStorage.setItem('refreshToken', tokens.refreshToken);
                    loggedIn = true;
                },
                isLogged: function(){
                    return loggedIn
                },
                logout: function(){
                    localStorage.clear();
                    loggedIn = false;
                    $rootScope.go('/')
                },
                checkAuthCtrl: function () {
                    var deferred = $q.defer();
                    if (loggedIn) deferred.resolve();
                    else {
                        deferred.reject()
                    }
                    return deferred.promise;
                },
                showLogin: function(redirectTo){
                    ModalService.showModal({
                        templateUrl: "template/modal/auth.html",
                        controller: function ($scope, close, $element) {
                            var q = {};
                            if (redirectTo) q = {redirectTo: redirectTo}
                            $scope.signin = function (invalid, data) {
                                $scope.loginError = '';
                                if (invalid) return;
                                $http.get('/sign-in', {params: {login: data.login, password: data.password}}).success(function (resp) {
                                    resObj.setTokens({
                                        accessToken: resp.data.accessToken.value,
                                        refreshToken: resp.data.refreshToken.value
                                    });
                                    $scope.close(q)
                                }).error(function (err) {
                                    if (err.error == 'Item not found')
                                        $scope.loginError = 'User with this login not found';
                                    else
                                        $scope.loginError = 'Password not correct'
                                });
                            };
                            $scope.signup = function (invalid, data) {
                                $scope.emailError = '';
                                if (invalid) return;
                                $http.post('/sign-up', data).success(function (resp) {
                                    resObj.setTokens({
                                        accessToken: resp.data.accessToken.value,
                                        refreshToken: resp.data.refreshToken.value
                                    });
                                    $scope.close(q)
                                }).error(function (err) {
                                    if (err.errors.email)
                                        $scope.emailError = 'The email already in use'
                                })
                            };
                            $scope.close = function(res){
                                $element.modal('hide');
                                close(res, 200)
                            }
                        }
                    }).then(function (modal) {
                        modal.element.modal();
                        modal.close.then(function (result) {
                            if (result.redirectTo)
                                $location.path(result.redirectTo)

                        });
                    });
                }

            };

            return resObj
        }]);
