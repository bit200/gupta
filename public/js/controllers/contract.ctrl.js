/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('contractCtrl', ['$scope', '$rootScope', '$location', '$http', 'getContent', 'ModalService', '$timeout'
    , function (scope, rootScope, location, http, getContent, ModalService, $timeout) {

        console.log("@@ GET CONTENT CONTRACT CONTROLLER", getContent)
        rootScope.extend_scope(scope, getContent)

        scope.job = scope.job || (scope.contract ? scope.contract.job : null)
        scope.freelancer = scope.freelancer || (scope.contract ? scope.contract.freelancer : null)
        scope.seller = scope.seller || (scope.contract ? scope.contract.seller : null)

        scope.buyer =
            scope.contract
                ? scope.contract.buyer
                : scope.job
                ? scope.job.buyer
                : null
        
        if (scope.suggest) {
            scope.contract = scope.contract || scope.suggest.contract
        }
        
        // scope.job = scope.job || {}
        // scope.freelancer = scope.freelancer || {}
        // scope.buyer = scope.buyer || {}
        scope.contract_orig = scope.contract || {
                title: scope.job.title,
                // information: scope.job.description,
                freelancer: scope.freelancer,
                job: scope.job,
                seller: scope.freelancer.user,
                buyer: scope.buyer,
                budget: scope.job.budget,
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

        scope.contract_reject_by_seller = function (message) {
            http.post('/api/contract/reject/' + scope.contract._id, {reject_reason: scope.contract.reject_reason}).then(function (resp) {
                console.log('resp', resp)
                scope.onSucc()
            }, function (err) {
                console.log('err', err)
            })
        }
        scope.contract_reject_by_buyer = function (message) {
            http.post('/api/contract/reject_by_buyer/' + scope.contract._id, {reject_reason: scope.contract.reject_reason}).then(function (resp) {
                console.log('resp', resp)
                scope.onSucc()

            }, function (err) {
                console.log('err', err)
            })
        }
        scope.contract_pause = function (message) {
            console.log('pause reasone', scope.contract.puase_reason)
            http.post('/api/contract/pause/' + scope.contract._id, {pause_reason: scope.contract.pause_reason}).then(function (resp) {
                console.log('resp', resp)
                scope.onSucc()

            }, function (err) {
                console.log('err', err)
            })
        }
        scope.contract_resume = function () {
            http.post('/api/contract/resume/' + scope.contract._id, {resume_reason: scope.contract.resume_reason}).success(function (resp) {
                console.log('resp', resp)
                scope.onSucc()

            }).error(scope.onErr)
        }
        scope.contract_approve_suggestion = function () {
            http.post('/api/contract/approve-suggestion/' + scope.contract._id, {resume_reason: scope.contract.resume_reason}).success(function (resp) {
                console.log('resp', resp)
            }).error(scope.onErr)
        }
        scope.contract_approve = function () {
            http.post('/api/contract/approve/' + scope.contract._id).success(function (resp) {
                scope.onSucc()
                console.log('resp', resp)
            }).error(scope.onErr)
        }
        scope.contract_mark_complete = function(invalid) {
            if (invalid) {
                rootScope.scrollToErr()
            } else {
                http.post('/api/contract/mark-complete/' + scope.contract._id, {complete_comment: scope.contract.complete_comment})
                    .success(function(data){
                        scope.suggest = data.data
                        scope.onSucc()
                    })
                    .error(scope.onErr)
            }
        }
        scope.contract_close = function (data) {
            data = scope.contract

            console.log('close info', data)
            http.post('/api/contract/close/' + data._id, {
                review_comment: data.review_comment,
                closure_comment: data.closure_comment,
                rating: data.rating
            }).success(function (resp) {
                console.log('resp', resp)
                scope.onSucc()
            }).error(scope.onErr)
        }

        scope.contract_suggest = function (invalid, type, _data) {
            if (invalid) {
                rootScope.scrollToErr()
            } else {
                http.post('/api/contract/suggest', pub_contr())
                    .success(function(data){
                        scope.suggest = data.data
                        scope.onSucc()
                    })
                    .error(scope.onErr)
            }
        }

        scope.update_suggest = function (invalid, type, _data) {
            if (invalid) {
                rootScope.scrollToErr()
            } else {
                http.post('/api/contract/suggest', pub_contr())
                    .success(function (data) {
                        scope.contract = data.data
                        scope.onSucc()
                    })
                    .error(scope.onErr)
            }
        }

        scope.contract_create = function (invalid, type, _data) {
            if (invalid) {
                rootScope.scrollToErr()
            } else {
                http.post('/api/contract', pub_contr())
                    .success(function (data) {
                        scope.contract = data.data
                        scope.onSucc()
                    })
                    .error(scope.onErr)
            }
        }

        scope.contract_update = function (invalid, type, _data) {
            if (invalid) {
                rootScope.scrollToErr()
            } else {

                http.post('/api/contract', pub_contr())
                    .success(function (data) {
                        scope.contract = data.data
                        scope.onSucc()
                    })
                    .error(scope.onErr)
            }
        }
        scope.contract_suggest_approve = function (invalid, type, _data) {

            if (invalid) {
                rootScope.scrollToErr()
            } else {

                http.post('/api/contract/suggest-approve', pub_contr())

                    .success(function (data) {
                        // scope.contract = data.data
                        scope.onSucc()
                    })
                    .error(scope.onErr)
            }
        }

        scope.update_contract_terms = function (invalid, type, _data) {

            if (invalid) {
                rootScope.scrollToErr()
            } else {

                http.post('/api/contract/edit-terms', pub_contr())

                    .success(function (data) {
                        // scope.contract = data.data
                        scope.onSucc()
                    })
                    .error(scope.onErr)
            }
        }

        function pub_contr() {
            var data = angular.copy(scope.contract)

            data.seller = getId(scope.contract_orig.seller)
            data.freelancer = getId(scope.contract_orig.freelancer)
            data.buyer = getId(scope.contract_orig.buyer)
            data.job = getId(scope.contract_orig.job)
            data.contract = getId(scope.contract_orig)
            data.info = scope.info

            return data
        }

        scope.btns_list_for_dir = rootScope.generate_btns_list(scope, ModalService)

    }]);
