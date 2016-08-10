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
            // resolve: {
            //     getContent: ["$q", "$http", "$stateParams", function ($q, $http, $stateParams) {
            //         return $q.all({
            //             location: $http.get('/get-content', {
            //                 params: {
            //                     name: 'Location',
            //                     query: {},
            //                     distinctName: 'name'
            //                 }
            //             })
            //         })
            //     }]
            // }
        });
    })

    .controller('DashboardCtrl', function DashboardController($scope, $http, store, jwtHelper, ModalService) {


    });
    
