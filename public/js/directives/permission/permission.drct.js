XYZCtrls.directive('permission', function () {
    return {
        restrict: 'EA',
        scope: true,
        controller: ['$scope', '$rootScope', function (scope, rootScope) {
            rootScope.each_scope(scope, function(name, item){
                if (item && item.permission_error) {

                    $('[permission]').html("<h3 class='mtop30 text-center'>You don't have permissions to see that page</h3>")
                }
                console.log("elelelelellee", name, item)
            })
            console.log("scopeeee")
        }]
    };
});