angular.module('admin.all_project', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function ($stateProvider) {
        $stateProvider.state('all_project', {
            url: '/all_project',
            controller: 'AllProjectCtrl',
            templateUrl: 'all_project/all_project.html',
            data: {
                requiresLogin: true
            }
        });
    })
    .controller('AllProjectCtrl', function AllProjectController($scope, $http, store, jwtHelper, ModalService) {
        $scope.selectFilter = 'pending';
        $scope.getAllProject = function (skip, limit) {
            var _skip = skip ? (skip - 1) * $scope.configPagination.countByPage : 0;
            $http.get('/admin/api/all/projects', {params: {limit: limit || $scope.configPagination.countByPage, skip: _skip}}).then(function (resp) {
                $scope.all_projects = resp.data.data.data;
                $scope.configPagination.totalCount = resp.data.data.count;
                $scope.configPagination.currentPage = skip;
            }, function (err) {
                console.log('err', err)
            })
        };


        $scope.cb = function (page) {
            $scope.getAllProject(page)
        };

        $scope.configPagination = {
            currentPage: 1,
            countByPage: 12,
            totalCount: 0
        };


        $scope.reject = function (item, index) {
            $scope.all_projects.splice(index, 1);
            $http.delete('/admin/api/job', {params: {_id: item._id}})
        }

    });
