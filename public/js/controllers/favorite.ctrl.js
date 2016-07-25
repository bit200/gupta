/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('favoriteCtrl', ['$scope', '$rootScope', '$location', '$http', 'ModalService', '$timeout', 'AuthService', function (scope, rootScope, location, http, ModalService, $timeout, AuthService) {
    http.get('/api/my/favorites').then(function (resp) {
        scope.profiles = resp.data
        console.log(scope.profiles)
    }, function (err) {
        console.log('err', err)
    })
}]);
