angular.module('admin.all_profile', [
    'ui.router',
    'angular-storage',
    'angular-jwt',
])
    .config(function ($stateProvider) {
        $stateProvider.state('all_profile', {
            url: '/all_profile/:type',
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

    .controller('AllProfileCtrl', function AllProfileController($scope, $http, $stateParams,$state, store, jwtHelper, ModalService, getContent, notify) {
        $scope.selectFilter = 'pending';
        $state.current.data.name = 'Profile > ' + $state.params.type;
        $scope.locations = getContent.location.data.data;
        $scope.display = {type: $stateParams.type};
        $scope.getFreelancer = function (skip, limit) {
            var _skip = ($scope.configPagination.currentPage - 1) * $scope.configPagination.countByPage;
            $http.post('/admin/api/all', {model: 'Freelancer', limit: $scope.configPagination.countByPage, skip: _skip}).then(function (resp) {
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
        $scope.getModels = function (model, type, query) {
            var _skip = ($scope.configPagination.currentPage - 1) * $scope.configPagination.countByPage;
            $http.post('/admin/api/all', {model: model, params: query || {}, query: {limit: $scope.configPagination.countByPage, skip: _skip}}).then(function (resp) {
                $scope.display.type = type;
                $scope.all_profiles = resp.data.data.data;
                if ($scope.configPagination.totalCount != resp.data.data.count) {
                    $scope.configPagination.totalCount = resp.data.data.count;
                    $scope.configPagination.currentPage = 1;
                }
            }, function (err) {
                notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
            })

        };
        $scope.downloadUrl = '';
        switch ($state.params.type) {
            case 'freelancers':
                $scope.downloadUrl = '/excel?model=Freelancer&type=freelancer';
                break;
            case 'agency':
                $scope.downloadUrl = '/excel?model=Freelancer&type=agency';
                break;
            case 'users':

                $scope.downloadUrl = '/excel?model=User&type=user';
                break;
            default:
                break;
        }

        $scope.max = 5;
        $scope.isReadonly = false;
        
        $scope.priceRate =0;
        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };
        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];

        $scope.cb = function (page) {
            switch ($scope.display.type) {
                case 'freelancers':
                    $scope.getModels('Freelancer', 'freelancers', {type: 'freelancer'});
                    break;
                case 'agency':
                    $scope.getModels('Freelancer', 'agency', {type: 'agency'});
                    break;
                case 'users':
                    $scope.getModels('User', 'users');
                    break;
                default:
                    break;
            }
        };

        $scope.configPagination = {
            currentPage: 1,
            countByPage: 12,
            totalCount: 0
        };

        $scope.check = function (type) {
            switch (type) {
                case 'freelancers':
                    $scope.getModels('Freelancer', 'freelancers', {type: 'freelancer'});
                    break;
                case 'agency':
                    $scope.getModels('Freelancer', 'agency', {type: 'agency'});
                    break;
                case 'users':
                    $scope.getModels('User', 'users');
                    break;
                default:
                    break;
            }
        };

        function spliceItem(index) {
            $scope.all_profiles.splice(index, 1);
        }

        function update_profile() {
            switch ($scope.display.type) {
                case 'freelancers':
                    $scope.getModels('Freelancer', 'freelancers', {type: 'freelancer'});
                    break;
                case 'agency':
                    $scope.getModels('Freelancer', 'agency', {type: 'agency'});
                    break;
                case 'users':
                    $scope.getModels('User', 'users');
                    break;
                default:
                    break;
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
                        $http.delete('/admin/api/delete', {params: {model: type == 'users' ? 'User' : 'Freelancer', _id: item._id}}).then(function () {
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

        $scope.showQuestionnaire = function (questionnaire) {
            ModalService.showModal({
                templateUrl: "all_profile/all_profile.question.html",
                controller: function ($scope, $element, $http) {
                    $scope.questionnaires = questionnaire
                    $scope.rows = function (item, num) {
                        if (num)
                            item.row_number = new Array(num);
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
        $scope.getInformation = function (change, user, type) {
            $scope.showModal = true;
            $scope.change = change;
            $scope.type = type;
            $scope.profile = angular.copy(user);
            $scope.submit = function (user) {
                $http.post('/admin/api/' + type, {user: user}).then(function (resp) {
                    update_profile();
                    $scope.close()
                })
            };
            $scope.close = function (res) {
                $scope.showModal = false;
            }
        }


    });
    
