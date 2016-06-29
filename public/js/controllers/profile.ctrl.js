/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('profileCtrl', ['$scope', '$location', '$http', '$stateParams', 'getContent', 'parseRating', function (scope, location, http, $stateParams, getContent, parseRating) {
    scope.profile = parseRating.rating(getContent.seller.data.data)[0];
}]);
