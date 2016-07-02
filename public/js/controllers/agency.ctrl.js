/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('AgencyCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', 'ModalService', 'AuthService',
    function (scope, location, http, parseType, $q, getContent, ModalService, AuthService) {
    scope.current_user = AuthService.currentUser();
    scope.agencies_area = {};
    scope.agencies = getContent.agencies.data.data;
    scope.businessAccounts = getContent.businessAccounts.data || [];
    scope.claim = function (agency) {
        ModalService.showModal({
            templateUrl: "template/modal/claimForm.html",
            inputs: {
                agency: agency
            },
            controller: function ($scope, close, $element, agency) {
                $scope.agency = agency;
                $scope.sendRequest = function (invalid, claimData) {
                    if (invalid) return;
                    claimData.agency = agency._id; 

                    http.post('/api/claim_request', claimData).success(function (resp) {
                        $scope.close(resp);
                    })
                };
                $scope.close = function(res){
                    $element.modal('hide');
                    close(res, 500);
                }

            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result){
                    scope.businessAccounts.push(result);
                }
            });
        });

    };

}]);
