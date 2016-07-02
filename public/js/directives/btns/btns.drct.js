XYZCtrls.directive('btns', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/btns/btns.html',
        link: function(scope, el, attrs) {
            scope.attrs = attrs
            scope.btns_list = eval(attrs.list)
            scope.btns_class_name = 'col-xs-' + (12 / scope.btns_list.length)
        },
        controller: ['$scope', function (scope) {
            console.log('@@@ Scope Post directive', scope.attrs)
        }]
    };
});