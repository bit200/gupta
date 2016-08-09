/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('favoriteCtrl', ['$scope', '$rootScope', '$location', '$http', 'ModalService', '$timeout', 'AuthService', 'notify', function (scope, rootScope, location, http, ModalService, $timeout, AuthService, notify) {
    scope.loading = true;
    scope.getFreelancer = function(){
        scope.loading = true;
        scope.favorites = [];
        http.get('/api/my/favorites/freelancer').then(function (resp) {
            scope.loading = false;
            scope.favorites = resp.data;
            console.log(resp)
        }, function (err) {
            scope.loading = false;
            notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
        })
    };
    
    scope.getJobs = function() {
        scope.favorites = [];
        scope.loading = true;
        http.get('/job/favorites').then(function (resp) {
            scope.favorites = resp.data;
            scope.loading = false;
            console.log(scope.profiles)
        }, function (err) {
            scope.loading = false;
            notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
        })
    }
}]);
