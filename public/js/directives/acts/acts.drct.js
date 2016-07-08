XYZCtrls.directive('acts', function () {
    return {
        restrict: 'E',
        scope: true,
        // transclude: true
        template: '<div class="action {{action.class_name}}" ng-repeat="action in actions track by $index">' +
        '<a ng-if="action.ui_sref" ui-sref="{{action.ui_sref}}">{{action.name}}</a>' +
        '<a ng-if="action.href" href="{{action.href}}">{{action.name}}</a>' +
        '<a ng-if="action.fn" ng-click="action.fn()">{{action.name}}</a>' +
        '</div>',
        controller: ['$scope', '$location', '$http', 'AuthService', '$state', 'notify', function (scope, $location, $http, AuthService, $state, notify) {
            var item = scope.item
                , info = JSON.parse(scope.info)
                , user_type = info.user_type
                , job_type = info.job_type


            function getInfo(item, field) {
                return item[field] || item
            }

            function _get_id_by_item(item) {
                return item._id || item
            }


            function getId(item, field) {

                var _item = getInfo(item, field) || getInfo((item || {}).contract, field);
                return _get_id_by_item(_item)
            }

            function createChatRoom(buyerID, sellerID, jobID) {
                var obj = {
                    buyer: buyerID,
                    seller: sellerID,
                    job: jobID
                };
                return $http.post('/api/create/chat', {params: obj})
            }

            scope.getId = getId;

            function sref(name, params) {
                name += '({';
                _.each(params, function (value, key) {
                    name += [key, ':', value, ','].join('');
                });
                if (name.slice(-1) == ',') {
                    name = name.slice(0, -1);
                }
                name += '})';

                return name
            }

            scope.list = {
                'Approve Contract': function () {
                    return {
                        name: 'View Contract',
                        ui_sref: sref("root.contract_approve", {contract: getId(item, 'contract')})
                    }
                },
                'View Job': function () {
                    return {
                        ui_sref: sref("root.job_detailed", {job: getId(item, 'job')})
                    }
                },
                'Reject': function () {
                    return {
                        fn: function () {
                            console.log("reject", item)
                            // alert('reject')
                            item.status = 'Rejected by buyer'
                            $http.post('/api/job-apply/reject/' + getId(item, 'apply')).success(function (data) {
                                item.status = data.data.status
                                init_btns()
                            }).error(function () {
                                //console.log("an error with reject")
                            })
                        }
                    }
                },
                'View Application': function () {
                    return {
                        ui_sref: sref("root.apply_detailed", {apply: getId(item, 'apply')})
                    }
                },
                'Create Contract': function () {
                    return {
                        name: 'Accept',
                        ui_sref: sref("root.contract_create", {
                            job: getId(item, 'job'),
                            freelancer: getId(item, 'freelancer')
                        })
                    }
                },
                'View Contract': function () {
                    return {
                        ui_sref: sref("root.contract_detailed", {contract: getId(item, 'contract')})
                    }
                },
                'View Suggestion': function () {
                    return {
                        ui_sref: sref("root.contract_suggest_detailed", {
                            suggest: getId(item.contract, 'suggest')
                        })
                    }
                },
                'Edit Suggestion': function () {
                    return {
                        ui_sref: sref("root.contract_suggest", {contract: getId(item, 'contract')})
                    }
                },
                'Edit Contract': function () {
                    return {
                        ui_sref: sref("root.contract_edit", {contract: getId(item, 'contract')})
                    }
                },
                'Pause Contract': function () {
                    return {
                        ui_sref: sref("root.contract_pause", {contract: getId(item, 'contract')})
                    }
                },
                'Resume Contract': function () {
                    return {
                        ui_sref: sref("root.contract_resume", {contract: getId(item, 'contract')})
                    }
                },
                'Close Contract': function () {
                    return {
                        ui_sref: sref("root.contract_close", {contract: getId(item, 'contract')})
                    }
                },
                'Initiate Payment': function () {
                    return {
                        ui_sref: sref("root.contract_inital_payment", {contract: getId(item, 'contract')})
                    }
                },
                'Mark completed': function () {
                    return {
                        ui_sref: sref("root.contract_mark_complete", {contract: getId(item, 'contract')})
                    }
                },

                'Recreate Job': function () {
                    return {
                        ui_sref: sref("root.job_recreate", {job: getId(item, 'job')})
                    }
                },
                'Communicate': function () {
                    return {
                        fn: function () {
                            var jobId = getId(item, 'job');
                            var buyerId = getId(item, 'buyer');
                            var sellerId = getId(item, 'seller');
                            var freelancerId = getId(item, 'freelancer');
                            var currentUser = AuthService.currentUser();
                            // var sellerId = getId(item, 'job')
                            console.log("comunicate Current item :: ", item);
                            console.log("comunicate jobId :: ", jobId);
                            console.log("comunicate freelancerId :: ", freelancerId);
                            console.log("comunicate sellerId :: ", sellerId);
                            console.log("comunicate buyerId :: ", buyerId);
                            console.log("comunicate currentUser :: ", currentUser);
                            // if (currentUser == buyerId) {
                                createChatRoom(buyerId, sellerId, jobId).then(function (resp) {
                                    $state.go('messages', {_id: resp.data.data._id});
                                }, function (err) {
                                    console.log(err);
                                    notify({message: err.data.error, duration: 3000, position: 'right', classes: 'alert-danger'});
                                });
                            // }
                        }
                    }
                }

            };

            scope.actions = [];

            function fn() {
                _.each(arguments, function (name) {
                    var _fn = scope.list[name]
                    if (_fn) {
                        var obj = _fn()
                        obj.name = obj.name || name
                        scope.actions.push(obj)
                    } else {
                    }
                })
            }

            function init_btns() {
                scope.actions = []
                fn('Communicate')

                console.log('ahahahahhahahahahahah', user_type, job_type, item.status)
                if (user_type == 'seller' && job_type == 'open') {
                    fn('View Application', 'View Job')
                    if (item.status == 'Seller terms approving' || item.status == 'Seller approving') {
                        fn('Approve Contract')
                    }
                    if (item.status == 'Buyer suggest approving') {
                        fn('View Suggestion')
                    }
                } else if (user_type == 'seller' && job_type == 'ongoing') {
                    fn('View Contract', 'View Job')
                    if (item.status != 'Marked as completed') {
                        fn('Mark completed')
                    }
                } else if (user_type == 'seller' && job_type == 'closed') {
                    fn('View Contract')
                    fn('View Job')


                } else if (user_type == 'buyer' && job_type == 'open') {
                    if (['Seller approving', 'Buyer suggest approving', 'Seller terms approving', 'Rejected by seller'].indexOf(item.status) < 0) {
                        fn('Create Contract')
                    }
                    if (item.status == 'Buyer suggest approving') {
                        fn('View Suggestion')
                    }
                    if (['Rejected by buyer', 'Rejected by seller'].indexOf(item.status) < 0) {
                        fn('Reject')
                    }

                } else if (user_type == 'buyer' && job_type == 'ongoing') {
                    if (item.status != 'Paused') {
                        fn('Pause Contract')
                    }
                    if (item.status == 'Paused') {
                        fn('Resume Contract')

                    }

                    fn('Edit Contract')
                    fn('Close Contract')
                    fn('Initiate Payment')

                } else if (user_type == 'buyer' && job_type == 'closed') {
                    fn('Recreate Job')
                    fn('View Contract')
                    fn('View Job')
                }
            }

            init_btns()

        }]
    };
});