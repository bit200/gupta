XYZCtrls.directive('error', function () {
    return {
        restrict: 'AE',
        scope: true,
        templateUrl: 'js/directives/error/error.html',
        controller: ['$scope', '$timeout', '$rootScope', function(scope, $timeout, $rootScope){
            scope.$watch('err_resp', function(v){
                console.log('err_resp', v )
                if (v && (v.cd > (new Date().getTime() - 1000))) {
                    scope.err_message = (v && (typeof v.message == 'string')) ? v.message : 'An error. Please try again later'
                    scope.start_ok = true
                    scope.finish_ok = false

                    $timeout(function(){
                        scope.start_ok = false
                        scope.finish_ok = true
                    }, 3000)
                }
            
            }, true);
        }]
    };
});