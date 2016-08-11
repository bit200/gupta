/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('contractApproveCtrl', ['$scope', '$location', '$http', 'getContent', '$stateParams', 'parseType', 'ModalService', 'notify', function (scope, location, http, getContent, stateParams, parseType, ModalService, notify) {
    scope.contract = parseType.contract(getContent.contract.data.data);
    scope.createContract = function (invalid, type, data) {
        http.post('/contract/' + type, data).then(function (resp) {
            type == 'delete' ? location.path('/home') : location.path('/home');
        }, function (err) {
            notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});        })
    };

    scope.respond = function (type) {
        switch (type) {
            case 'approve':
                approve();
                break;
            case 'reject':
                reject();
                break;
            case 'suggest':
                suggest();
                break;
        }
        function approve() {
            http.get('/contract/approve', {params: {_id: scope.contract._id}}).then(function (resp) {
                console.log(resp)
            }, function (err) {
                notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
            })
        }

        function reject() {
            ModalService.showModal({
                templateUrl: "template/modal/rejectContract.html",
                controller: function ($scope) {
                    $scope.send = function (text) {
                        scope.contract.reject_reason = text
                        http.post('/contract/reject', scope.contract).then(function (resp) {
                            console.log(resp)
                        }, function (err) {
                            notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
                        })
                    }
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            });

        }

        function suggest() {
            ModalService.showModal({
                templateUrl: "template/modal/suggestContract.html",
                controller: function ($scope) {
                    $scope.contract = scope.contract;
                    $scope.send = function (model) {
                        model.contract = scope.contract._id;
                        http.post('/contract/suggest', model).then(function (resp) {
                            console.log(resp)
                        }, function (err) {
                            notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
                        })
                    }
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            });

        }


    }
}]);
