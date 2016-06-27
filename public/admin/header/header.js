angular.module('admin').controller( 'HeaderCtrl', function HomeController( $scope, $http, store, $state, $rootScope) {
    $scope.logout = function(){
        $rootScope.isLogged = false;
        store.remove('jwt')
        $state.go('login');
    }
});
