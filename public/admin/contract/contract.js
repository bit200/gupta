angular.module('admin.contract', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function ($stateProvider) {
        $stateProvider.state('contract', {
            url: '/contract',
            controller: 'ContractCtrl',
            templateUrl: 'contract/contract.html',
            data: {
                requiresLogin: true,
                name: 'Contract'
            },
            resolve: {
                getContent: ["$q", "$http", "$stateParams", function ($q, $http, $stateParams) {
                    return $q.all({
                 
                    })
                }]
            }
        });
    })

    .controller('ContractCtrl', function ContractController($scope, $http, store, jwtHelper, ModalService, getContent, notify) {
        $scope.getContracts = function (skip, limit) {
            var _skip = ($scope.configPagination.currentPage - 1) * $scope.configPagination.countByPage;
            $http.get('/admin/api/all', {params: {model:'Contract',limit: limit || $scope.configPagination.countByPage, skip: _skip}}).then(function (resp) {
                $scope.contracts = resp.data.data.data;
                if(resp.data.data.count != $scope.configPagination.totalCount) {
                    $scope.configPagination.totalCount = resp.data.data.count;
                    $scope.configPagination.currentPage = 1;
                }
                   
            }, function (err) {
                notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
            })

        };

        $scope.cb = function (page) {
            $scope.getContracts(page)
        };

        $scope.configPagination = {
            currentPage: 1,
            countByPage: 12,
            totalCount: 0
        };

        $scope.check = function (type) {
            $scope.getUsers()
        };
        
        function spliceItem(index){
            $scope.contracts.splice(index, 1);
        }
        
        function update_table(){
            $scope.getContracts()
        }
        
    
        $scope.reject = function (item, index, type) {
            ModalService.showModal({
                templateUrl: "delete_modal.html",
                controller: function ($scope, $element, $http) {
                    $scope.submit = function () {
                        spliceItem(index);
                        $http.delete('/admin/api/delete', {params: {model:'Contract', _id: item._id}}).then(function(){
                            update_table();
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

        $scope.getInformation = function (user) {
            ModalService.showModal({
                templateUrl: "contract/contract.view.html",
                controller: function ($scope, $element, $http) {
                    $scope.contract = angular.copy(user);
                    $scope.submit = function (user) {
                        $http.post('/admin/api/change', {model:'Contract', item :user}).then(function (resp) {
                            update_table();
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
    
