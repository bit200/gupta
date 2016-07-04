/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('commonCtrl', ['$scope', 'getContent', '$rootScope', '$http',
    function (scope, getContent, rootScope, $http) {
        scope.getContent = getContent;

        scope.onSucc = function (data) {
            scope.resp = data.data
            scope.succ_resp = true
        }
        scope.onErr = rootScope.onError


        // scope.job = rootScope.getContent(getContent, 'job') || {}
        // scope.freelancer = rootScope.getContent(getContent, 'freelancer') || {}
        // scope.buyer = rootScope.getContent(getContent, 'user') || {}
        // scope.suggest = rootScope.getContent(getContent, 'suggest')
        // scope.contract = rootScope.getContent(getContent, 'contract')
        // scope.apply = rootScope.getContent(getContent, 'apply')

        _.each(['job', 'freelancer', 'buyer', 'suggest', 'contract', 'apply', 'i'], function (item) {
            scope[item] = rootScope.getContent(getContent, 'job') || {}
            console.log('COMMON CTRL CTRL CTRL ', item, ':', scope[item])
        })
        scope.i = getContent.i
    }]);
