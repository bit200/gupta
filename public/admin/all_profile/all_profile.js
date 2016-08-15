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
                requiresLogin: true,
                name: 'Profile'
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

    .controller('AllProfileCtrl', function AllProfileController($scope, $http, store, jwtHelper, ModalService, getContent, notify) {
        $scope.selectFilter = 'pending';
        $scope.locations = getContent.location.data.data;
        $scope.display = {type: 'freelancers'};
        $scope.getFreelancer = function (skip, limit) {
            var _skip = ($scope.configPagination.currentPage - 1) * $scope.configPagination.countByPage;
            $http.get('/admin/api/all', {params: {model: 'Freelancer', limit: $scope.configPagination.countByPage, skip: _skip}}).then(function (resp) {
                $scope.display.type = 'freelancers';
                $scope.all_profiles = resp.data.data.data;
                if ($scope.configPagination.totalCount != resp.data.data.count) {
                    $scope.configPagination.totalCount = resp.data.data.count;
                    $scope.configPagination.currentPage = 1;
                }
            }, function (err) {
                notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
            })
        };
        $scope.getUsers = function (skip, limit) {
            var _skip = ($scope.configPagination.currentPage - 1) * $scope.configPagination.countByPage;
            $http.get('/admin/api/all', {params: {model: 'User', limit: $scope.configPagination.countByPage, skip: _skip}}).then(function (resp) {
                $scope.display.type = 'users';
                $scope.all_profiles = resp.data.data.data;
                if ($scope.configPagination.totalCount != resp.data.data.count) {
                    $scope.configPagination.totalCount = resp.data.data.count;
                    $scope.configPagination.currentPage = 1;
                }
            }, function (err) {
                notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
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

        function spliceItem(index) {
            $scope.all_profiles.splice(index, 1);
        }

        function update_profile() {
            if ($scope.display.type == 'freelancers') {
                $scope.getFreelancer()
            } else {
                $scope.getUsers()
            }
        }

        $scope.getFavorite = function (freelancer, index) {
            $http.post('/admin/api/sorted', {_id: freelancer._id, sorted: freelancer.sorted || false}).then(function (resp) {
                $scope.all_profiles[index] = resp.data.data
            }, function (err) {
                notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
            })
        };

        $scope.reject = function (item, index, type) {
            ModalService.showModal({
                templateUrl: "delete_modal.html",
                controller: function ($scope, $element, $http) {
                    console.log(type)
                    $scope.submit = function () {
                        $http.delete('/admin/api/' + type, {params: {_id: item._id}}).then(function () {
                            spliceItem(index);

                            $scope.close()
                        })
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
        };

        $scope.getInformation = function (user, type) {
            ModalService.showModal({
                templateUrl: "all_profile/all_profile.view.html",
                controller: function ($scope, $element, $http) {
                    $scope.type = type;
                    $scope.profile = angular.copy(user);
                    $scope.submit = function (user) {
                        console.log(user);
                        $http.post('/admin/api/' + type, {user: user}).then(function (resp) {
                            update_profile()
                            $scope.close()
                        })
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
    });
    
