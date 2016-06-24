var XYZAdminCtrls = angular.module('XYZAdminCtrls', [])

XYZAdminCtrls.controller('loginCtrl', ['$location', '$timeout', '$scope', '$http',
    function ($location, $timeout, scope, $http) {
        scope.auth = localStorage.getItem('accessToken') ? $location.path('/sellers') : false;
        scope.login = {};
        scope.loginSend = function (data) {
            $('.login-login').removeClass('failed');
            $('.login-password').removeClass('failed');

            $http.get('/sign-in', {params: {login: data.login, password: data.password}}).then(function (resp) {
                localStorage.setItem("accessToken", resp.data.data.accessToken.value);
                localStorage.setItem("refreshToken", resp.data.data.refreshToken.value);
                scope.auth = true;
                scope.MainContentLoaded = true;
                $location.path('/users')
            }, function (error) {
                $location.path('/login');
                if (error.data.error == 'Item not found') {
                    $('.login-login').addClass('failed');
                }
                if (error.data.error == 'Wrong password') {
                    $('.login-password').addClass('failed')
                }
                scope.MainContentLoaded = true
            });
            scope.login.password = '';
        };
        scope.logout = function (e) {
            localStorage.clear();
            scope.auth = false;
        };
    }]);

XYZAdminCtrls.controller('userCtrl', ['$location', '$timeout', '$scope', '$http', '$rootScope', '$q', 'getContent', 'parseType',
    function ($location, $timeout, scope, $http, rs, $q, getContent, parseType) {
        scope.isActive = {
            users: true
        };

        scope.users = parseType.users(getContent.users.data.data);
        scope.approved = function (user, i) {
            $http.get('/approved', {params: {username: user.username}}).then(function (resp) {
                scope.users[i] = parseType.users([resp.data.data])[0];
            }, function (err) {
            })
        };

        scope.rejectUser = function (data, i) {
            $http.get('/reject', {params: {username: scope.check.user.username, reject_reason: data}}).then(function (resp) {
                scope.users[scope.check.i] = parseType.users([resp.data.data])[0];
                scope.reject = false;
            }, function (err) {
            })
        };

        scope.showReject = function (bol, user, i) {
            scope.reject_text = '';
            scope.reject = bol;
            scope.check = {
                user: user,
                i: i
            }
        };

        scope.resObj = {};
        scope.delete = false;
    }]);

XYZAdminCtrls.controller('claimCtrl', ['$location', '$timeout', '$scope', '$http', '$rootScope', '$q', 'getContent', 'parseType', 'ModalService',
    function ($location, $timeout, scope, $http, rs, $q, getContent, parseType, ModalService) {
        scope.isActive = {
            claims: true
        };

        scope.agency = parseType.claim(getContent.agency.data.data);
        scope.showModal = function (bol, item) {
            ModalService.showModal({
                templateUrl: "templates/modal/agency.html",
                controller: function ($scope) {
                    $scope.agencyRequest = item.elem;
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            })
        };

        scope.approveAgency = function (type, email) {
            $http.get('/' + type + '-agency', {params: {email: email}}).then(function (resp) {
                scope.showAgency = false;
                _.forEach(scope.agency, function (item) {
                    if (item.elem.email == email) {
                        item.data.Status = (type == 'approve') ? 'Claimed' : 'Unclaimed';
                    }
                })
            })
        };
    }]);

XYZAdminCtrls.controller('jobCtrl', ['$location', '$timeout', '$scope', '$http', '$rootScope', '$q', 'getContent', 'parseType', 'ModalService',
    function ($location, $timeout, scope, $http, rs, $q, getContent, parseType, ModalService) {
        scope.isActive = {
            jobs: true
        };
        scope.job = parseType.job(getContent.job.data.data);
        scope.showJob = function (bol, type, item) {
            ModalService.showModal({
                templateUrl: "templates/modal/job.html",
                controller: function ($scope) {
                    $scope.jobModalType = type;
                    $scope.JobChoice = item;
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            })

        };
        scope.approveJob = function (type, text, reject_type) {

            var params = {
                params: {
                    _id: scope.JobChoice
                }
            };

            if (reject_type == 'suggest-edit') {
                params.params.reject_reason = text
            }

            if (reject_type == 'reject') {
                params.params.reject_reason = text
            }

            console.log('/' + type + '-job');
            $http.get('/' + type + '-job', params).then(function (resp) {
                scope.showJobModal = false;
                _.forEach(scope.job, function (item) {
                    if (item.elem._id == scope.JobChoice) {
                        item.data.admin_approved = (type == 'approve') ? 'Approved' : 'Rejected';
                    }
                })
            })
        }
    }]);

XYZAdminCtrls.controller('categoryCtrl', ['$location', '$timeout', '$scope', '$http', '$rootScope', '$q', 'getContent', 'ModalService',
    function ($location, $timeout, scope, $http, rs, $q, getContent, ModalService) {
        scope.service = getContent.service.data.data;
        scope.contentType = getContent.contentType.data.data;
    }]);

XYZAdminCtrls.controller('sellerCtrl', ['$location', '$timeout', '$scope', '$http', '$rootScope', '$q', 'getContent', 'parseType', 'ModalService', 'parseRating',
    function ($location, $timeout, scope, $http, rs, $q, getContent, parseType, ModalService, parseRating) {
        scope.isActive = {
            sellers: true
        };
        scope.sellers = parseType.seller(getContent.sellers.data.data);
        scope.service = getContent.service.data.data;
        scope.locations = getContent.locations.data.data;
        scope.showProfile = function (id) {
            $http.get('/freelancer', {params: {_id: id}}).then(function (resp) {
                ModalService.showModal({
                    templateUrl: "templates/modal/modalSeller.html",
                    controller: function ($scope) {
                        $scope.profile = parseRating.rating(resp.data.data)[0];
                        $scope.createChat = function (id) {

                        }
                    }
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                    });

                });
            });
        };

        scope.reset = function () {
            delete scope.filter
        }
    }]);

XYZAdminCtrls.controller('mainCtrl', ['$location', '$timeout', '$scope', '$http', '$rootScope',
    function (location, $timeout, scope, http, rs) {
        scope.isActive = {
            sellers: true
        };

        scope.choice = function (choice) {
            _.forEach(scope.isActive, function (value, key) {
                scope.isActive[key] = false
            });
            scope.isActive[choice] = true;
            location.path('/' + choice)
        };

        scope.logout = function (e) {
            localStorage.clear();
            scope.auth = false;
        };


    }]);

