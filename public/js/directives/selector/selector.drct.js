XYZCtrls.directive('selector', function () {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            type: '=',
            className: '=',
            open: '@',
            onSelectCustom: '&'
        },
        templateUrl: 'js/directives/selector/selector.html',
        controller: ['$scope', '$rootScope', '$state', '$timeout', 'jobInformation', function (scope, $rootScope, $state, $timeout, jobInformation) {
            scope.onOpen = function (e) {
                var status = scope.open;
                $rootScope.closePopupFn();
                e.stopPropagation();
                e.preventDefault();
                $timeout(function () {
                    scope.open = !status
                }, 1);
                return;
            };

            scope.init = function () {
                $rootScope.info = $rootScope.info || {};
                var value = $rootScope.info[scope.type];
                _.each(scope.items, function (item) {
                    if (item.toLowerCase() == value) {
                        scope.selected = item
                        var obj = {};
                        obj[scope.type] = item;
                        jobInformation.setInfo(obj);
                    }
                })
            };

            scope.onSelect = function (item, e) {
                var obj = {};
                obj[scope.type] = item;
                jobInformation.setInfo(obj);
                if (scope.onSelectCustom) {
                    scope.onSelectCustom({item: item})
                }
                $rootScope.info[scope.type] = item;
                var state = 'jobs_list.' + ($rootScope.info.user_type ? $rootScope.info.user_type : $rootScope.asView.buyer ? 'buyer' : 'seller') + '_' + ($rootScope.info.job_type || 'open');
                $state.go(state.toLowerCase());
                scope.selected = item;
                scope.open = false;
                e.preventDefault();
                e.stopPropagation();
                return;
            };

            $rootScope.$watch('closePopup', function () {
                scope.open = false;
            });
            $rootScope.$on('$stateChangeSuccess', function (event, current) {
                setTimeout(scope.init, 1)
            });
            scope.init()

        }]
    };
});