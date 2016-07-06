XYZCtrls.directive('btns', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/btns/btns.html',
        link: function(scope, el, attrs) {
            console.log('scope2', scope.list2)
            // scope.attrs = attrs
            // scope.btns_list_plain = eval(attrs.list)
            // scope.btns_list = []
            // _.each(scope.btns_list_plain, function(name){
            //
            //     if (scope.btns_list_for_dir[name]) {
            //         scope.btns_list.push(scope.btns_list_for_dir[name])
            //     } else {
            //         //console.log('@@@@ BTN DIRECTIVE not found', name)
            //     }
            // })
            // //console.log('@aaaaaaa', scope.btns_list)
            // scope.btns_class_name = 'col-xs-' + (12 / scope.btns_list.length)
        },
        controller: ['$scope', '$attrs', function (scope, attrs) {
            function gid(name) {
                return scope[name] ? scope[name]._id || -1 : -1
            }

            scope.attrs = attrs
            var str = attrs.list || ''
            str = str.replace(/'/gi, '"')
            console.log('state objbjbjbjbjbjbjjb', str)

            scope.btns_list_plain = eval(str)
            // var _parse = JSON.parse(['"', attrs.list, '"'].join(''))
            // var _parse = JSON.parse(attrs.list)
            console.log('ahahahahahhahahahhaha', scope.btns_list_plain)
            scope.btns_list = []
            _.each(scope.btns_list_plain, function(item){
                var name = item
                // var obj = _state_obj[name] || _state_obj['root.' + name]
                if (item.fn) {
                    console.log("bobjbjbjbjjbjbjb", item)
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
            //console.log('@aaaaaaa', scope.btns_list)
            scope.btns_class_name = 'col-xs-' + (12 / scope.btns_list.length)
            //console.log('@@@ Scope Post directive', scope.attrs)
        }]
    };
});