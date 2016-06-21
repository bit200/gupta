/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('agencyCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', function (scope, location, http, parseType, $q, getContent) {
    scope.requestBusiness = false;
    scope.agency = parseType.agency(getContent.agency.data.data);
    scope.claim = function (agency, bol) {
        scope.choiceAgency = agency;
        scope.requestBusiness = bol;
    };

    scope.sendRequest = function (invalid, data) {

        if (invalid) return;
        scope.req = {
            data: data,
            agency: scope.choiceAgency
        };

        http.post('/request-business', scope.req).then(function (resp) {
            scope.requestBusiness = false;
            _.forEach(scope.agency, function (item) {
                if (item['Agency Name'] == scope.choiceAgency) {
                    item.Status = true
                }
            })
        })
    };
}]);
