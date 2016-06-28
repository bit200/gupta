/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('viewMyJobCtrl', ['$scope','getContent', function (scope, getContent) {
    scope.totalItems = 64;
    scope.currentPage = 4;
    scope.setPage = function (pageNo) {
        scope.currentPage = pageNo;
    };
    scope.maxSize = 7;
    scope.bigTotalItems = 6555;
    scope.bigCurrentPage = 20 ;
    scope.url = getContent.url.url
    scope.typeUser = getContent.user
}]);
