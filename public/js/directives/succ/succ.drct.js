XYZCtrls.directive('succ', function () {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'js/directives/succ/succ.html',
        link: function(scope, el, attrs) {
            scope.attrs = attrs
            console.log('@@@@ LNKS DIR', scope.attrs)
            scope.mess_title = attrs.title
            scope.mess_desc = attrs.desc
            scope.links_plain = eval(attrs.links)
            scope.mess_links = []
            _.each(scope.links_plain, function(name){
                var _link = scope.links_list_for_dir[name]
                if (_link) {
                    scope.mess_links.push(scope.links_list_for_dir[name])
                } else {
                    console.log("@@@ NOT FOUND LNKS FOR DIRECTIVE", name, scope.links_list_for_dir)

                }
            })
        },
        controller: ['$scope', function (scope) {
            console.log('@@@ Scope Post directive', scope.attrs)
        }]
    };
});