/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('contractCtrl', ['$scope', '$rootScope', '$location', '$http', 'getContent', 'ModalService', '$timeout', function (scope, rootScope, location, http, getContent, ModalService, $timeout) {
    console.log("@@ GET CONTENT CONTRACT CONTROLLER", getContent)
    scope.onSucc = function(data) {
        console.log("on succccccccc", data, data.data)
        scope.resp = data.data
        scope.succ_resp = true
    }

    scope.test2 = function() {
        alert("aaa")
    }

    scope.job = rootScope.getContent(getContent, 'job') || {}
    scope.freelancer = rootScope.getContent(getContent, 'freelancer') || {}
    scope.buyer = rootScope.getContent(getContent, 'user') || {}
    scope.suggest = rootScope.getContent(getContent, 'suggest')
    
    
    console.log('GET content', scope.suggest)

    scope.i = getContent.i

    // $timeout(function(){
    //     scope.succ_resp = true
    // }, 1000);
    //
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

    scope.contract = angular.extend({}, scope.contract_orig, scope.suggest, scope.contract_orig.suggest, {_id: scope.contract_orig._id})

    scope.contract.expected_completion = new Date(scope.contract.expected_completion)
    scope.contract.expected_start = new Date(scope.contract.expected_start)

    var getId = function (item) {
        return item ? item._id || item : null
    }

    scope.rating = 5;
    scope.rateFunction = function (rating) {
        alert('Rating selected - ' + rating);
    };

    scope.reject = function (message) {
        http.post('/api/contract/reject/' + scope.contract._id, {reject_reason: scope.contract.reject_reason}).then(function (resp) {
            console.log('resp', resp)
        }, function (err) {
            console.log('err', err)
        })
    }

    scope.pause = function (message) {
        console.log('pause reasone', scope.contract.puase_reason)
        http.post('/api/contract/pause/' + scope.contract._id, {pause_reason: scope.contract.pause_reason}).then(function (resp) {
            console.log('resp', resp)
        }, function (err) {
            console.log('err', err)
        })
    }
    scope.approve_suggestion = function () {

    }
    scope.approve = function () {
        http.post('/api/contract/approve/' + scope.contract._id).then(function (resp) {
            console.log('resp', resp)
        }, function (err) {
            console.log('err', err)
        })
    }

    scope.resume = function () {
        http.post('/api/contract/resume/' + scope.contract._id, {resume_reason: scope.contract.resume_reason}).then(function (resp) {
            console.log('resp', resp)
        }, function (err) {
            console.log('err', err)
        })
    }

    scope.close = function (data) {
        console.log('close info', data)
        http.post('/api/contract/close/' + data._id, {
            review_comment: data.review_comment,
            closure_comment: data.closure_comment,
            rating: data.rating
        }).then(function (resp) {
            console.log('resp', resp)
        }, function (err) {
            console.log('err', err)
        })
    }

    scope.contract_suggest = function (invalid, type, _data) {
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
            http.post('/api/contract/suggest', data).success(scope.onSucc).error($rootScope.onError)
        }
    }

    scope.contract_create = function (invalid, type, _data) {
        if (invalid) {
            rootScope.scrollToErr()
        } else {
            var data = angular.copy(_data)
            console.log("data", data)

            data.seller = getId(data.seller)
            data.freelancer = getId(data.freelancer)
            data.buyer = getId(data.buyer)
            data.job = getId(data.job)


            http.post('/api/contract', data).success(function (data) {
                // type == 'delete' ? location.path('/home') : location.path('/home');
                scope.succ_resp = true
                scope.resp = data.data
                console.log('resp', scope.resp)
            }, function (err) {
                scope.error = err
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
