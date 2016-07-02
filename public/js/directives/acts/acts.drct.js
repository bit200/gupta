XYZCtrls.directive('acts', function () {
    return {
        restrict: 'E',
        scope: true,
        // transclude: true
        template: '<a ng-if="action.ui_sref" ui-sref="{{action.ui_sref}}" class="action {{action.class_name}}" ng-repeat="action in actions track by $index">{{action.name}}</a>' +
        '<a ng-if="action.href" href="{{action.href}}" class="action {{action.class_name}}" ng-repeat="action in actions track by $index">{{action.name}}</a>',
        controller: ['$scope', '$location', function (scope, $location) {
            var item = scope.item
                , info = JSON.parse(scope.info)
                , user_type = info.user_type
                , job_type = info.job_type


            function getInfo(item, field) {
                return item[field] || item
            }

            function getId(item) {
                return item._id || item
            }

            function getInfoId(item, field) {
                return getId(getInfo(item, field))
            }

            function sref (name, params) {
                name += '({';
                _.each(params, function(value, key){
                    name += [key, ':', value, ','].join('');
                });
                if (name.slice(-1) == ',') {
                    name = name.slice(0, -1);
                }
                name += '})';

                return name
            }

            function is_role (str1, str2) { //is_role
                var arr1 = str1.split('_')
                var arr2 = str2.split('_')

                var flag_user, flag_job
                _.each(arr1, function(item){
                    if ((item == user_type) || (item == '*')) {
                        flag_user = true
                    }
                })

                _.each(arr2, function(item){
                    if ((item == job_type) || (item == '*')) {
                        flag_job = true
                    }
                })

                return flag_job && flag_user
            }



            scope.list = {
                'Approve Contract': function () {
                    return {
                        is_visible: function() {
                            if (is_role('seller', 'open') && item.contract)
                                return {
                                    class: 'selected'
                                }

                        },
                        name: 'View Contract',
                        ui_sref: sref("root.contract_approve", {id: getInfoId(item, 'contract')})
                    }
                },
                'View Job': function () {
                    return {
                        is_visible: function() {
                            if (is_role('seller', 'open'))
                                return true
                            else if (is_role('buyer', 'closed'))
                                return true
                        },
                        ui_sref: sref("root.job_detailed", {id: getInfoId(item, 'job')})

                    }
                },
                'View Application': function () {
                    return {
                        is_visible: function() {
                            if (is_role('seller', 'open'))
                                return true
                        },
                        ui_sref: sref("root.apply_detailed", {id: getInfoId(item, 'apply')})

                    }
                },
                'Accept': function () {
                    return {
                        is_visible: function(){
                            if (is_role('buyer', 'open') && !item.contract)
                                return true;
                        },
                        ui_sref: sref("root.contract_approve", {job: getInfoId(item, 'job'), freelancer: getInfoId(item, 'freelancer')})
                    }
                },

                'View Contract': function () {
                    return {
                        is_visible: function() {
                            if (is_role('*', 'ongoing'))
                                return true
                            else if (item.contract && !is_role('seller', 'open'))
                                return true
                            else if (is_role('*', 'closed'))
                                return true
                        },
                        ui_sref: sref("root.contract_detailed", {id: getInfoId(item, 'contract')})
                    }
                },
                'View Suggestion': function () {
                    return {
                        is_visible: function() {
                            if (is_role('*', 'open') && (item.status == 'suggest approving'))
                                return true
                        },
                        ui_sref: sref("contract_suggest_detailed", {id: getInfoId(item, 'suggest')})
                    }
                },
                'Edit Suggestion': function () {
                    return {
                        is_visible: function() {
                            if (is_role('seller', 'open') && (item.status == 'suggest approving'))
                                return true
                        },
                        ui_sref: sref("root.contract_suggest", {id: getInfoId(item, 'contract')})
                    }
                },
                'Edit Contract': function () {
                    return {
                        is_visible: function() {
                            if (is_role('buyer', 'ongoing'))
                                return true
                        },
                        ui_sref: sref("root.contract_edit", {id: getInfoId(item, 'contract')})
                    }
                },
                'Pause Contract': function () {
                    return {
                        is_visible: function() {
                            if (is_role('buyer', 'ongoing') && item.status != 'paused')
                                return true
                        },
                        ui_sref: sref("root.contract_pause", {id: getInfoId(item, 'contract')})
                    }
                },
                'Resume Contract': function () {
                    return {
                        is_visible: function() {
                            if (is_role('buyer', 'ongoing') && item.status == 'paused')
                                return true
                        },
                        ui_sref: sref("root.contract_resume", {id: getInfoId(item, 'contract')})
                    }
                },
                'Close Contract': function () {
                    return {
                        is_visible: function() {
                            if (is_role('buyer', 'ongoing'))
                                return true
                        },
                        ui_sref: sref("root.contract_close", {id: getInfoId(item, 'contract')})
                    }
                },
                'Initiate Payment': function () {
                    return {
                        is_visible: function() {
                            if (is_role('buyer', 'ongoing'))
                                return true
                        },
                        ui_sref: sref("root.contract_inital_payment", {id: getInfoId(item, 'contract')})
                    }
                },
                'Mark Complete': function () {
                    return {
                        is_visible: function() {
                            if (is_role('seller', 'ongoing'))
                                return true
                        },
                        ui_sref: sref("contract.mark_complete", {id: getInfoId(item, 'contract')})
                    }
                },

                'Recreate Job': function () {
                    return {
                        is_visible: function() {
                            console.log("getInfoId(item, 'job')", item, getInfoId(item, 'job'), getInfo(item, 'job'))
                            if (is_role('buyer', 'closed'))
                                return true
                        },
                        ui_sref: sref("root.job_recreate", {id: getInfoId(item, 'job')})
                    }
                },
                // 'Communicate': function () {
                //     return {
                //         is_visible: function() {
                //             return true
                //         },
                //         ui_sref: sref("messages", {id: getInfoId(item, 'apply')})
                //
                //     }
                // },

            };

            scope.actions = [];

            function fn () {
                _.each(arguments, function(name){
                    var _fn = scope.list[name]
                    if (_fn) {
                        var obj = _fn()
                        obj.name = obj.name || name
                        scope.actions.push(obj)
                    } else {
                        console.log('NAME NOT FOUNDDDDDDDD', name)
                    }
                })
            }

            if (user_type == 'seller' && job_type == 'open') {
                fn('View Application', 'View Job')
                if (item.status == 'seller approving') {
                    console.log('approve contract', item)
                    fn('Approve Contract')
                }
            } else if (user_type == 'seller' && job_type == 'ongoing') {
                
            } else if (user_type == 'seller' && job_type == 'closed') {
                
            } else if (user_type == 'buyer' && job_type == 'open') {
                
            } else if (user_type == 'buyer' && job_type == 'ongoing') {
                
            } else if (user_type == 'buyer' && job_type == 'closed') {
                
            }
           
        }]
    };
});