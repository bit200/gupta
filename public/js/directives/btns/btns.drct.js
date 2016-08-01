XYZCtrls.directive('btns', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/btns/btns.html',
        link: function(scope, el, attrs) {
            var str = attrs.listScope
            if (str && str != '') {
                scope.btns_list_plain = eval(str)
                scope.init_btns(str)
            }
            scope.init_btns()
        },
        controller: ['$scope', '$attrs', '$rootScope', 'AuthService', function (scope, attrs, rootScope, AuthService) {
            function gid(name) {
                return scope[name] ? scope[name]._id || -1 : -1
            }

            scope.attrs = attrs
            var str = attrs.list || ''
            str = str.replace(/'/gi, '"')

            function isinvalid (v) {
                return v ? v.$invalid : null
            }
            scope.on_fn = function(btn) {
                if (isinvalid(scope.postjob) || isinvalid(scope.formContract)) {
                    scope.onErr && scope.onErr({message: 'Please fill all fields'})
                    rootScope.scrollToErr()
                } else {
                    // alert('ok')
                    btn.fn && btn.fn(isinvalid(scope.postjob) || isinvalid(scope.postjob))
                }
            }

            scope.init_btns = function(){
                scope.btns_list = []
                _.each(scope.btns_list_plain, function(item){
                    var name = item
                    // var obj = _state_obj[name] || _state_obj['root.' + name]
                    var userId = AuthService.userId()
                    if (item.is_owner) {
                        var fl = null
                        _.each(item.is_owner, function(own){
                            var f_item = scope
                            _.each(own.split('.'), function(field){
                                f_item = f_item ? f_item[field] : null
                            })
                            console.log('gid(f_item)', f_item)
                            if (f_item && f_item == userId) {
                                fl = true
                            }
                        })
                        if (!fl) {
                            return;
                        }
                    }

                    if (item.fn) {
                        scope.btns_list.push({
                            fn: scope[item.fn],
                            name: item.name
                        })
                    } else if (item.ui_sref) {
                        scope.btns_list.push({
                            ui_sref: item.ui_sref,
                            ui_params: function(){
                                var ui_params = item.ui_params
                                var obj = {}
                                obj[ui_params] = scope[ui_params]._id
                                return obj
                            },
                            name: item.name
                        })
                    } else if (scope.btns_list_for_dir[name]) {
                        scope.btns_list.push(scope.btns_list_for_dir[name])
                    } else {
                        //console.log('@@@@ BTN DIRECTIVE not found', name)
                    }
                })
                scope.btns_class_name = 'col-xs-' + (12 / scope.btns_list.length)
            }


            if (str && str != '') {
                scope.btns_list_plain = eval(str)
                scope.init_btns(str)
            }
            // var _parse = JSON.parse(['"', attrs.list, '"'].join(''))
            // var _parse = JSON.parse(attrs.list)

        }]
    };
});
