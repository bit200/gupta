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
        controller: ['$scope', '$location', '$http', function (scope, $location, $http) {
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

                var _item = getInfo(item, field) || getInfo((item || {}).contract, field)
                return _get_id_by_item(_item)
            }

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
                            //console.log("reject", item)
                            $http.post('/api/job-apply/reject/' + getId(item, 'apply')).success(function(data){
                                item.status = data.data.status
                                //console.log("rejected")
                            }).error(function(){
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
                'Mark Complete': function () {
                    return {
                        ui_sref: sref("contract.mark_complete", {contract: getId(item, 'contract')})
                    }
                },

                'Recreate Job': function () {
                    return {
                        ui_sref: sref("root.job_recreate", {job: getId(item, 'job')})
                    }
                },
                'Communicate': function () {
                    return {
                        ui_sref: sref("messages", {apply: getId(item, 'apply')})
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
                        //console.log('NAME NOT FOUNDDDDDDDD', name)
                    }
                })
            }

            if (user_type == 'seller' && job_type == 'open') {
                fn('View Application', 'View Job')
                if (item.status == 'seller approving') {
                    fn('Approve Contract')
                }
                if (item.status == 'suggest approving') {
                    fn('View Suggestion')
                }
            } else if (user_type == 'seller' && job_type == 'ongoing') {

            } else if (user_type == 'seller' && job_type == 'closed') {

            } else if (user_type == 'buyer' && job_type == 'open') {
                if (['suggest approving'].indexOf(item.status) < 0) {
                    fn('Create Contract')
                }
                if (item.status == 'suggest approving') {
                    fn('View Suggestion')
                }
                if (item.status !== 'rejected') {
                    fn('Reject')
                }

            } else if (user_type == 'buyer' && job_type == 'ongoing') {
                if (item.status != 'paused') {
                    fn('Pause Contract')
                }
                if (item.status == 'paused') {
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

        }]
    };
});