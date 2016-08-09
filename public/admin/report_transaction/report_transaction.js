angular.module('admin.report_transaction', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function ($stateProvider) {
        $stateProvider.state('report_transaction', {
            url: '/report_transaction',
            controller: 'TransactionCtrl',
            templateUrl: 'report_transaction/report_transaction.html',
            data: {
                requiresLogin: true,
                name: 'Transaction'
            },
            resolve: {
                getContent: ["$q", "$http", "$stateParams", function ($q, $http, $stateParams) {
                    return $q.all({
                        payments: $http.get('/payments')
                    })
                }]
            }
        });
    })

    .controller('TransactionCtrl', function AllProfileController($scope, $http, store, jwtHelper, ModalService, getContent) {
        console.log('TransactionCtrl',getContent);
        $scope.configPagination = {
            currentPage: 1,
            countByPage: 12,
            totalCount: 0
        };
        $scope.payments = getContent.payments.data.item;
        $scope.configPagination.totalCount = getContent.payments.data.count;
        $scope.getPayment = function(){
            $http.get('/payments', {params:{skip:($scope.configPagination.currentPage - 1)*$scope.configPagination.countByPage, limit:$scope.configPagination.countByPage}}).then(function(resp){
                $scope.payments = resp.data;
            })
        };
        $scope.cb = function (page) {
            $scope.getPayment()
        };


    });


