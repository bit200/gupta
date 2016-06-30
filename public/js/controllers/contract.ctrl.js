/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('contractCtrl', ['$scope', '$rootScope', '$location', '$http', 'getContent', 'ModalService', function (scope, rootScope, location, http, getContent, ModalService) {
    scope.job = rootScope.getContent(getContent, 'job') || {}
    scope.freelancer = rootScope.getContent(getContent, 'freelancer') || {}
    scope.buyer = rootScope.getContent(getContent, 'user') || {}


    scope.contract = rootScope.getContent(getContent, 'contract') || {
        title: scope.job.title,
        freelancer: scope.freelancer,
        job: scope.job,
        seller: scope.freelancer.user,
        buyer: scope.buyer,
        budget: scope.job.budget,
        buyer_name: rootScope.getBuyerName(scope.buyer),
        buyer_company_name: scope.buyer.company_name,
        seller_contact: scope.freelancer.contact_detail,
        seller_name: scope.freelancer.name,
        final_amount: scope.job.budget,
        expected_completion: new Date().getTime() + 24 * 3600 * 1000 * 30,
        expected_start: new Date().getTime()
    }
    console.log('shshshshshshshhshs', scope.contract)
    scope.contract.expected_completion = new Date(scope.contract.expected_completion)
    scope.contract.expected_start = new Date(scope.contract.expected_start)

    var getId = function(item) {
        return item ? item._id || item : null
    }


    scope.createContract = function (invalid, type, _data) {
        if (invalid) {
            rootScope.scrollToErr()
        } else {
            var data = angular.copy(_data)
            console.log("data", data)

            data.seller = getId(data.seller)
            data.freelancer = getId(data.freelancer)
            data.buyer = getId(data.buyer)
            data.job = getId(data.job)


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
            scope: scope,
            controller: function ($scope) {
                $scope.contract = scope.contract;
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
            });

        });
    }
}]);
