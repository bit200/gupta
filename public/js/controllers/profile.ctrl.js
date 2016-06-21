/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('profileCtrl', ['$scope', '$location', '$http', '$routeParams', 'parseRating', function (scope, location, http, $routeParams, parseRating) {
    http.get('/get-user', {params: {id: $routeParams.id}}).then(function (resp) {
        scope.profile = parseRating.rating([resp.data.data])[0];
    })
}]);
