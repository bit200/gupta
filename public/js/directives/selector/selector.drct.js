XYZCtrls.directive('selector', function () {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            type: '=',
            className: '=',
            open: '@'
        },
        templateUrl: 'js/directives/selector/selector.html',
        controller: ['$scope', '$rootScope', '$state', function (scope, $rootScope, $state) {
            scope.init = function() {
                var value = $rootScope.info[scope.type]
                console.log('hhhhhhhhhhhhhh', value)
                _.each(scope.items, function(item){
                    console.log('aaaaa', value, item, scope.selected)
                    if (item.toLowerCase() == value) {
                        scope.selected = item
                    }
                })
            }
            
            scope.onSelect = function (item) {
                // alert('selected')
                $rootScope.info[scope.type] = item
                console.log('rorororrororoor', $rootScope.info)
                scope.selected = item
                scope.open = false
                console.log('ahahahahahahhahahahahah', 'jobs_list.' + $rootScope.info.user_type + '_' + $rootScope.info.job_type)
                var state = 'jobs_list.' + $rootScope.info.user_type + '_' + $rootScope.info.job_type
                $state.go(state.toLowerCase())

            }

            $rootScope.$on('$stateChangeSuccess', function(event, current) {
                setTimeout(scope.init, 1)
             });
            scope.init()

        }]
    };
});