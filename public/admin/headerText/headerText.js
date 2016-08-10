angular.module('admin.header_text', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function ($stateProvider) {
        $stateProvider.state('header_text', {
            url: '/headerText',
            controller: 'HeaderTextCtrl',
            templateUrl: 'headerText/headerText.html',
            data: {
                requiresLogin: true,
                name: 'Header Text'
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

    .controller('HeaderTextCtrl', function HeaderTextController($scope, $http, store, jwtHelper, ModalService, getContent, notify) {

        $scope.getHeaders = function () {
            var skip = ($scope.configPagination.currentPage - 1) * $scope.configPagination.countByPage;
            $http.get('/admin/api/header', {params: {limit: $scope.configPagination.countByPage, skip: skip}}).then(function (resp) {
                $scope.headers = resp.data.data;
            }, function (err) {
                notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
            })

        };

        $scope.cb = function () {
            $scope.getHeaders();
        };

        $scope.configPagination = {
            currentPage: 1,
            countByPage: 12,
            totalCount: 0
        };

        $scope.add_default = function () {
            $http.get('/api/common_filters').then(function (commonFilters) {
                $scope.filter = _.keys(commonFilters.data);
                $http.post('/admin/api/header/default', {array: $scope.filter}).then(function (resp) {
                    console.log('resp', resp);
                })
            })
        };

    

        $scope.changeItem = function (item, bol) {
            item.change = bol;
        };

        function spliceItem(index) {
            $scope.headers.splice(index, 1);
        }

        function modalGetHeader() {
            $scope.getHeaders();
        }

        $scope.changeItem = function (item) {
            ModalService.showModal({
                templateUrl: "headerText/headerText.view.html",
                controller: function ($scope, $element, $http) {
                    $scope.item = angular.copy(item);
                    $scope.submit = function (header) {
                        delete header._id;
                        delete header.created_at;
                        delete header.__v;
                        delete header.change;
                        $http.post('/admin/api/header/update', header).then(function () {
                            modalGetHeader();
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
    
