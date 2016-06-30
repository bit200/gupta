XYZCtrls.directive('isEdited', function () {
    return {
        restrict: 'AE',
        scope: true,
        link: function(scope, el, attrs) {
            var field = attrs.isEdited
            var string = 'contract.' + field
            var original = scope.contract[field]
            scope.$watch(string, function(current) {
                el.toggleClass('edited', original != current)
            }, true);
        }
    };
});