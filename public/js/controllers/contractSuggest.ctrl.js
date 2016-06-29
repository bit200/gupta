/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('contractSuggestCtrl', ['$scope', '$location', '$http', 'getContent', '$stateParams', 'parseType', 'ModalService', function (scope, location, http, getContent, stateParams, parseType, ModalService) {
    scope.suggest = parseType.contract(getContent.suggest.data.data);
    scope.contract = scope.suggest.contract;
    scope.contract.expected_start = parseDate(scope.contract.expected_start);
    scope.contract.expected_completion = parseDate(scope.contract.expected_completion);
    scope.suggest.expected_start = parseDate(scope.suggest.expected_start);
    scope.suggest.expected_completion = parseDate(scope.suggest.expected_completion);
    function parseDate(date) {
        var today = new Date(date);
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        return (mm + '-' + dd + '-' + yyyy);
    }

    scope.respond = function (type) {
        type == 'apply'? apply(): cancel()
    };

    function apply() {
        http.post('/contract/suggest-apply', {suggest: scope.suggest}).then(function (resp) {
            console.log('resp', resp)
        }, function (err) {
            console.log('err', err)
        })
    }

    function cancel() {
        http.get('/contract/suggest-cancel', {params: {id: scope.suggest.contract._id}}).then(function (resp) {
                console.log('resp', resp)
            },
            function (err) {
                console.log('err', err)
            })
    }
}]);
