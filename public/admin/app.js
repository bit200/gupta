angular.module( 'admin', [
  'admin.login',
  'admin.sellers',
  'admin.business_accounts',
  'angular-jwt',
  'angular-storage',
  'angularModalService',
  'ngDialog',
  'cgNotify',
  'angular-loading-bar',
  'smart-table',
  'admin.jobs'
])
.config( ["$urlRouterProvider", "jwtInterceptorProvider", "$httpProvider", function myAppConfig ($urlRouterProvider, jwtInterceptorProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/sellers');

  jwtInterceptorProvider.tokenGetter = function(store) {
    return store.get('jwt');
  };

  $httpProvider.interceptors.push('jwtInterceptor');
}])
.run(["$rootScope", "$state", "store", "jwtHelper", function($rootScope, $state, store, jwtHelper) {
  $rootScope.$on('$stateChangeStart', function(e, to) {
    if (to.data && to.data.requiresLogin) {
      if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
        e.preventDefault();
        $state.go('login');
        $rootScope.isLogged = false;
      }else
        $rootScope.isLogged = true;
    }
  });
}])
.controller( 'AppCtrl', ["$scope", "$location", "$state", function AppCtrl ( $scope, $location, $state ) {
  $scope.$state = $state
}]);

