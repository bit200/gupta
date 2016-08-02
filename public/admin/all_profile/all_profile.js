angular.module('admin.all_profile', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function ($stateProvider) {
        $stateProvider.state('all_profile', {
            url: '/all_profile',
            controller: 'AllProfileCtrl',
            templateUrl: 'all_profile/all_profile.html',
            data: {
                requiresLogin: true
            },
            resolve: {
                getContent: ["$q", "$http", "$stateParams", function ($q, $http, $stateParams) {
                    return $q.all({
                        location: $http.get('/get-content', {
                            params: {
                                name: 'Location',
                                query: {},
                                distinctName: 'name'
                            }
                        })
                    })
                }]
            }
        });
    })

    .controller('AllProfileCtrl', function AllProfileController($scope, $http, store, jwtHelper, ModalService, getContent) {
        $scope.selectFilter = 'pending';
        $scope.locations = getContent.location.data.data;
        $scope.getFreelancer = function (skip, limit) {
            var _skip = skip ? (skip - 1) * $scope.configPagination.countByPage : 0;
            $http.get('/admin/api/all/freelancer', {params: {limit: limit || $scope.configPagination.countByPage, skip: _skip}}).then(function (resp) {
                $scope.display.type = 'freelancers';
                $scope.all_profiles = resp.data.data.data;
                $scope.configPagination.totalCount = resp.data.data.count;
                $scope.configPagination.currentPage = skip;
            }, function (err) {
                console.log('err', err)
            })
        };
        $scope.getUsers = function (skip, limit) {
            var _skip = skip ? (skip - 1) * $scope.configPagination.countByPage : 0;
            $http.get('/admin/api/all/users', {params: {limit: limit || $scope.configPagination.countByPage, skip: _skip}}).then(function (resp) {
                $scope.display.type = 'users';
                $scope.all_profiles = resp.data.data.data;
                $scope.configPagination.totalCount = resp.data.data.count;
                $scope.configPagination.currentPage = skip;
            }, function (err) {
                console.log('err', err)
            })

        };

        $scope.cb = function (page) {
            $scope.display.type == 'freelancers' ? $scope.getFreelancer(page) : $scope.getUsers(page)
        };

        $scope.configPagination = {
            currentPage: 1,
            countByPage: 12,
            totalCount: 0
        };

        $scope.check = function (type) {
            type == 'freelancers' ? $scope.getFreelancer(1) : $scope.getUsers(1)
        };

        $scope.reject = function (item, index) {
            ModalService.showModal({
                templateUrl: "delete_modal.html",
                controller: function ($scope, $element, $http) {
                    $scope.submit = function () {
                        $scope.all_profiles.splice(index, 1);
                        $http.delete('/admin/api/' + $scope.display.type, {params: {_id: item._id}})
                    };
                    $scope.close = function (res) {
                        $element.modal('hide');
                        close(res, 500);
                    }
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            });

        }

        $scope.getInformation = function (user, type) {
            ModalService.showModal({
                templateUrl: "all_profile/all_profile.view.html",
                controller: function ($scope, $element, $http) {
                    $scope.type = type;
                    $scope.profile = user;
                    $scope.submit = function (user) {
                        $http.post('/admin/api/' + type, {user: user}).then(function (resp) {
                            $scope.close()
                        })
                    }
                    $scope.close = function (res) {
                        $element.modal('hide');
                        close(res, 500);
                    }
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            });
        }

    })
    
