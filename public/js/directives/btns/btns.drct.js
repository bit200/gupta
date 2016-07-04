XYZCtrls.directive('btns', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/btns/btns.html',
        link: function(scope, el, attrs) {
            scope.attrs = attrs
            scope.btns_list_plain = eval(attrs.list)
            scope.btns_list = []
            _.each(scope.btns_list_plain, function(name){
                if (scope.btns_list_for_dir[name]) {
                    scope.btns_list.push(scope.btns_list_for_dir[name])
                } else {
                    //console.log('@@@@ BTN DIRECTIVE not found', name)
                }
            })
            //console.log('@aaaaaaa', scope.btns_list)
            scope.btns_class_name = 'col-xs-' + (12 / scope.btns_list.length)
        },
        controller: ['$scope', function (scope) {
            //console.log('@@@ Scope Post directive', scope.attrs)
        }]
    };
});