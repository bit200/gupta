/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('postJobCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', '$stateParams', 'ModalService', '$timeout',
    function (scope, location, http, parseType, $q, getContent, stateParams, ModalService, $timeout) {
        console.log('post job ctrl', getContent)
        scope.job = {
            title: 'hie',
            description: 'hie'
        }
    }]);