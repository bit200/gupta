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
                requiresLogin: true
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
        console.log('TransactionCtrl',getContent)
        $scope.payments = getContent.payments.data;

    });


