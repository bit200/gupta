angular.module('admin.job_apply', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function ($stateProvider) {
        $stateProvider.state('job_apply', {
            url: '/job_apply',
            controller: 'JobApplyCtrl',
            templateUrl: 'job_apply/job_apply.html',
            data: {
                requiresLogin: true,
                name: 'Job Apply'
            },
            resolve: {
                getContent: ["$q", "$http", "$stateParams", function ($q, $http, $stateParams) {
                    return $q.all({
                 
                    })
                }]
            }
        });
    })

    .controller('JobApplyCtrl', function JobApplyController($scope, $http, store, jwtHelper, ModalService, getContent, notify) {
        $scope.getJobs = function (skip, limit) {
            var _skip = ($scope.configPagination.currentPage - 1) * $scope.configPagination.countByPage;
            $http.post('/admin/api/all', {model:'JobApply', limit: $scope.configPagination.countByPage, skip: _skip}).then(function (resp) {
                $scope.jobApplies = resp.data.data.data;
                if(resp.data.data.count != $scope.configPagination.totalCount) {
                    $scope.configPagination.totalCount = resp.data.data.count;
                    $scope.configPagination.currentPage = 1;
                }
                   
            }, function (err) {
                notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
            })

        };

        $scope.cb = function (page) {
            $scope.getJobs(page)
        };

        $scope.configPagination = {
            currentPage: 1,
            countByPage: 12,
            totalCount: 0
        };

        function spliceItem(index){
            $scope.jobApplies.splice(index, 1);
        }
        
        function update_table(){
            $scope.getJobs()
        }
    
        $scope.reject = function (item, index, type) {
            ModalService.showModal({
                templateUrl: "delete_modal.html",
                controller: function ($scope, $element, $http) {
                    $scope.submit = function () {
                        spliceItem(index);
                        $http.delete('/admin/api/delete', {params: {model:'JobApply',_id: item._id}}).then(function(){
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
                templateUrl: "job_apply/job_apply.view.html",
                controller: function ($scope, $element, $http) {
                    $scope.job = user;
                    $scope.submit = function (user) {
                        $http.post('/admin/api/change', {model:'JobApply', item :user}).then(function (resp) {
                            update_table();
                            $scope.close();
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
    
