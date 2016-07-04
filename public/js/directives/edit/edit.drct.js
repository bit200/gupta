XYZCtrls.directive('owner', function () {
    return {
        restrict: 'AE',
        template: '<i class="fa fa-pencil"></i>',
        link: function(scope, el, attrs) {
            scope.owner = attrs.owner
            if (attrs.owner == scope.userId) {
                el.addClass('visible')
            }
        },
        controller: ['$scope', 'AuthService', '$rootScope', '$attrs', '$element'
            , function(scope, AuthService, $rootScope, attrs, el){
            scope.userId = AuthService.userId()
        }]
    };
});