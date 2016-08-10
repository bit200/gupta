angular.module('admin', [
    'directive',
    'admin.login',
    'admin.sellers',
    'admin.categories',
    'admin.locations',
    'admin.dashboard',
    'admin.all_profile',
    'admin.all_project',
    'admin.business_accounts',
    'admin.questionnaire',
    'admin.report_transaction',
    'angular-jwt',
    'angular-storage',
    'angularModalService',
    'ngDialog',
    'cgNotify',
    'ngFileUpload',
    'ngMaterial',
    'angular-loading-bar',
    'smart-table',
    'admin.jobs'
])
    .config(["$urlRouterProvider", "jwtInterceptorProvider", "$httpProvider", function myAppConfig($urlRouterProvider, jwtInterceptorProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/all_profile');

        jwtInterceptorProvider.tokenGetter = function (store) {
            return store.get('jwt');
        };

        $httpProvider.interceptors.push('jwtInterceptor');
    }])

    .run(["$rootScope", "$state", "store", "jwtHelper", function ($rootScope, $state, store, jwtHelper) {
        $rootScope.loadData = false;
        $rootScope.$on('$stateChangeStart', function (e, to) {
            if (to.data && to.data.requiresLogin) {
                if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
                    e.preventDefault();
                    window.location = '/admin/login';
                    $rootScope.isLogged = false;
                } else
                    $rootScope.isLogged = true;
            }
        });
    }])

    .controller('AppCtrl', ["$scope", "$location", '$rootScope', "$state", 'store', function AppCtrl($scope, $location, $rootScope, $state, store) {
        $scope.$state = $state;
        $scope.name = store.get('name');
        $rootScope.loadData = true;
        $scope.logout = function () {
            $rootScope.isLogged = false;
            store.remove('jwt');
            window.location = '/admin/login';
        }
    }])

