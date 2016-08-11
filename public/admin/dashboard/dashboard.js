angular.module('admin.dashboard', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function ($stateProvider) {
        $stateProvider.state('dashboard', {
            url: '/dashboard',
            controller: 'DashboardCtrl',
            templateUrl: 'dashboard/dashboard.html',
            data: {
                requiresLogin: true,
                name: 'Dashboard'
            }
        });
    })

    .controller('DashboardCtrl', function DashboardController($scope, $http, store, jwtHelper, ModalService) {


    });
    
