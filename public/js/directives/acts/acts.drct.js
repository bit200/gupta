XYZCtrls.directive('acts', function () {
    return {
        restrict: 'E',
        scope: true,
        // transclude: true
        template: '<a ng-if="action.ui_sref" ui-sref="{{action.ui_sref}}" class="action {{action.class_name}}" ng-repeat="action in actions track by $index">{{action.name}}</a>' +
        '<a ng-if="action.href" href="{{action.href}}" class="action {{action.class_name}}" ng-repeat="action in actions track by $index">{{action.name}}</a>',
        controller: ['$scope', '$location', function (scope, $location) {
            var item = scope.item
                , info = JSON.parse(scope.info);
            var user_type = info.user_type,
                job_type = info.job_type


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
                    console.log('nameeeeeee', key, value)
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

            console.log('------------ ', is_role('seller', 'open'), user_type, job_type)


            scope.list = {
                'Approve Ctrct': function () {
                    return {
                        is_visible: function() {
                            if (is_role('seller', 'open') && item.contract)
                                return {
                                    class: 'selected'
                                }

                        },
                        ui_sref: sref("contract_approve", {id: getInfoId(item, 'contract')})
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
                        ui_sref: sref("job", {id: getInfoId(item, 'job')})

                    }
                },
                'View Application': function () {
                    return {
                        is_visible: function() {
                            if (is_role('seller', 'open'))
                                return true
                        },
                        ui_sref: sref("job_apply_detailed", {id: getInfoId(item, 'apply')})

                    }
                },
                'Accept': function () {
                    return {
                        is_visible: function(){
                            if (is_role('buyer', 'open') && !item.contract)
                                return true;
                        },
                        ui_sref: sref("contract_create_job_freelancer", {job: getInfoId(item, 'job'), freelancer: getInfoId(item, 'freelancer')})
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
                        ui_sref: sref("contract_detailed", {id: getInfoId(item, 'contract')})
                    }
                },
                'Edit Contract': function () {
                    return {
                        is_visible: function() {
                            if (is_role('buyer', 'ongoing'))
                                return true
                        },
                        ui_sref: sref("contract_edit", {id: getInfoId(item, 'contract')})
                    }
                },
                'Pause Contract': function () {
                    return {
                        is_visible: function() {
                            if (is_role('buyer', 'ongoing') && item.status != 'paused')
                                return true
                        },
                        ui_sref: sref("contract_pause", {id: getInfoId(item, 'contract')})
                    }
                },
                'Resume Contract': function () {
                    return {
                        is_visible: function() {
                            if (is_role('buyer', 'ongoing') && item.status == 'paused')
                                return true
                        },
                        ui_sref: sref("contract_resume", {id: getInfoId(item, 'contract')})
                    }
                },
                'Close Contract': function () {
                    return {
                        is_visible: function() {
                            if (is_role('buyer', 'ongoing'))
                                return true
                        },
                        ui_sref: sref("contract_close", {id: getInfoId(item, 'contract')})
                    }
                },
                'Initiate Payment': function () {
                    return {
                        is_visible: function() {
                            if (is_role('buyer', 'ongoing'))
                                return true
                        },
                        ui_sref: sref("contract_edit", {id: getInfoId(item, 'contract')})
                    }
                },
                'Mark Complete': function () {
                    return {
                        is_visible: function() {
                            if (is_role('seller', 'ongoing'))
                                return true
                        },
                        ui_sref: sref("contract_edit", {id: getInfoId(item, 'contract')})
                    }
                },

                'Recreate Job': function () {
                    return {
                        is_visible: function() {
                            if (is_role('buyer', 'closed'))
                                return true
                        },
                        ui_sref: sref("contract_edit", {id: getInfoId(item, 'contract')})
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

            _.each(scope.list, function (obj_fn, field) {
                var obj = obj_fn(item);
                var approve = obj.is_visible && obj.is_visible()
                if (approve) {
                    obj.class_name = approve
                    obj.name = field
                    scope.actions.push(obj)
                }

            });
        }]
    };
});