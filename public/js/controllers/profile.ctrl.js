/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('profileCtrl', ['$scope', '$location', '$http', '$routeParams', 'getContent', 'parseRating', function (scope, location, http, $routeParams, getContent, parseRating) {
    scope.profile = parseRating.rating(getContent.seller.data.data)[0];
}]);
