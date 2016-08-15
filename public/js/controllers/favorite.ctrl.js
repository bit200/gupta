/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('favoriteCtrl', ['$scope', '$rootScope', '$location', '$http', 'ModalService', '$timeout', 'AuthService', 'notify', '$state', function (scope, rootScope, location, http, ModalService, $timeout, AuthService, notify,$state) {
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
    scope.favorite = [];
    http.get('/api/my/favorite').success(function (favorites) {
        scope.favorite = favorites;
    });

    scope.addFavorite = function (profileId) {
        http.get('/api/freelancer/' + profileId + '/favorite/add').then(function () {
            scope.favorite.push(profileId)
        }, function (err) {
            if (err.status == 401) {
                $state.go('login')
            }
        });
    };

    scope.removeFavorite = function (profileId) {
        http.get('/api/freelancer/' + profileId + '/favorite/remove').then(function () {
            scope.favorites.splice(scope.favorites.indexOf(profileId), 1);
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
