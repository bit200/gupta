/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('contractCtrl', ['$scope', '$rootScope', '$location', '$http', 'getContent', 'ModalService', function (scope, rootScope, location, http, getContent, ModalService) {
    scope.job = rootScope.getContent(getContent, 'job') || {}
    scope.freelancer = rootScope.getContent(getContent, 'freelancer') || {}
    scope.buyer = rootScope.getContent(getContent, 'user') || {}
<<<<<<< Updated upstream
    scope.suggest = rootScope.getContent(getContent, 'suggest')

    scope.info = getContent.info


    scope.contract_orig = rootScope.getContent(getContent, 'contract') || {
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

    scope.contract = angular.extend({}, scope.contract_orig, scope.suggest, {_id: scope.contract_orig._id})

    console.log('getContent', getContent, scope.info)
    console.log('shshshshshshshhshs', scope.contract)
    scope.contract.expected_completion = new Date(scope.contract.expected_completion)
    scope.contract.expected_start = new Date(scope.contract.expected_start)

    var getId = function(item) {
        return item ? item._id || item : null
    }

    scope.reject = function() {
        http.delete('/api/contract/reject/' + scope.contract._id).then(function (resp) {
            console.log('resp', resp)
        }, function (err) {
            console.log('err', err)
        }) 
    }
    scope.pause = function() {
        http.post('/api/contract/pause/' + scope.contract._id).then(function (resp) {
            console.log('resp', resp)
        }, function (err) {
            console.log('err', err)
        })
    }
    scope.suggestEdits = function(invalid, type, _data) {
        if (invalid) {
            rootScope.scrollToErr()
        } else {
            var data = angular.copy(_data)

            data.seller = getId(data.seller)
            data.freelancer = getId(data.freelancer)
            data.buyer = getId(data.buyer)
            data.job = getId(data.job)
            data.contract = getId(scope.contract_orig)

            console.log('suggest edit', data, scope.info)
            data.info = scope.info
            http.post('/api/contract/suggest', data).then(function (resp) {
=======
    scope.contract = rootScope.getContent(getContent, 'contract')
    console.log("buyyyerr", scope.buyer, scope.job, scope.freelancer)
    scope.contract = scope.contract || {
        // title: scope.job.title,
        // seller: scope.freelancer,
        // buyer: scope.buyer,
        // buyer_name: rootScope.getBuyerName(scope.buyer),
        // buyer_company_name: scope.buyer.company_name,
        // seller_contact: String,
        // seller_name: scope.freelancer.name,
        // final_amount: scope.job.budget
    }

    scope.createContract = function (invalid, type, data) {
        console.log('create contract',invalid, type, data)
        if (!invalid) {
            http.post('/contract/' + type, data).then(function (resp) {
                type == 'delete' ? location.path('/home') : location.path('/home');
>>>>>>> Stashed changes
                console.log('resp', resp)
            }, function (err) {
                console.log('err', err)
            })
<<<<<<< Updated upstream
        }
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
=======
        } else {
            rootScope.scrollToErr()
        }
>>>>>>> Stashed changes

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
