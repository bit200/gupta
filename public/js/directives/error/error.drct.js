XYZCtrls.directive('error', function () {
    return {
        restrict: 'AE',
        scope: true,
        templateUrl: 'js/directives/error/error.html',
        controller: ['$scope', '$timeout', '$rootScope', function(scope, $timeout, $rootScope){
            scope.$watch('err_resp', function(v){
                console.log('err_resp', v)
                if (v) {

                    scope.err_message = v.message == 'String' ? v.message : 'An error. Please try again later'
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