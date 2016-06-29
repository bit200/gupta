/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('postJobCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', '$routeParams', 'ModalService', '$timeout',
    function (scope, location, http, parseType, $q, getContent, routeParams, ModalService, $timeout) {
        console.log('post job ctrl', getContent)
        scope.job = {
            title: 'hie',
            description: 'hie'
        }
    }]);