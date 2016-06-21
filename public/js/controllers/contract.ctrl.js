/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('contractCtrl', ['$scope', '$location', '$http', 'getContent', 'ModalService', function (scope, location, http, getContent, ModalService) {
    scope.contract = getContent.contract.data.data;
    scope.createContract = function (invalid, type, data) {
        http.post('/contract/' + type, data).then(function (resp) {
            type == 'delete' ? location.path('/home') : location.path('/home');
            console.log('resp', resp)
        }, function (err) {
            console.log('err', err)
        })
    }

    scope.preview = function () {
        ModalService.showModal({
            templateUrl: "template/modal/previewContract.html",
            controller: function ($scope) {
                $scope.contract = scope.contract;
                $scope.contract.expected_start = parseDate($scope.contract.expected_start);
                $scope.contract.expected_completion = parseDate($scope.contract.expected_completion);
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

            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
            });

        });
    }
}]);
