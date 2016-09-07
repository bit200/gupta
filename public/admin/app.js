angular.module('admin', [
    'directive',
    'admin.login',
    'ui.bootstrap',
    'admin.sellers',
    'admin.categories',
    'admin.locations',
    'admin.languages',
    'admin.dashboard',
    'admin.header_text',
    'admin.contract',
    'admin.chat',
    'admin.users',
    'admin.job_apply',
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
    'jkAngularRatingStars',
    'admin.jobs',
])
    .config(["$urlRouterProvider", "jwtInterceptorProvider", "$httpProvider", function myAppConfig($urlRouterProvider, jwtInterceptorProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/dashboard');

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

