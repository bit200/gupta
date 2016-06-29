/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('contractCtrl', ['$scope', '$rootScope', '$location', '$http', 'getContent', 'ModalService', function (scope, rootScope, location, http, getContent, ModalService) {
    scope.job = rootScope.getContent(getContent, 'job') || {}
    scope.freelancer = rootScope.getContent(getContent, 'freelancer') || {}
    scope.buyer = rootScope.getContent(getContent, 'user') || {}
    console.log("buyyyerr", scope.buyer, scope.job, scope.freelancer)
    scope.contract = {
        title: scope.job.title,
        freelancer: scope.freelancer,
        seller: scope.freelancer.user,
        buyer: scope.buyer,
        budget: scope.job.budget,
        buyer_name: rootScope.getBuyerName(scope.buyer),
        buyer_company_name: scope.buyer.company_name,
        seller_contact: scope.freelancer.contact_detail,
        seller_name: scope.freelancer.name,
        final_amount: scope.job.budget
    }
    var getId = function(item) {
        return item._id || item
    }
    scope.createContract = function (invalid, type, data) {
        if (invalid) {
            rootScope.scrollToErr()
        } else {
            console.log("data", data)
            data.seller = getId(data.seller)
            data.freelancer = getId(data.freelancer)
            data.buyer = getId(data.buyer)
            data.job = getId(scope.job)
            
            http.post('/api/contract', data).then(function (resp) {
                // type == 'delete' ? location.path('/home') : location.path('/home');
                console.log('resp', resp)
            }, function (err) {
                console.log('err', err)
            })
        }

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
