XYZCtrls.directive('isEdited', function () {
    return {
        restrict: 'AE',
        scope: true,
        link: function(scope, el, attrs) {
            var field = attrs.isEdited
            var string = 'contract.' + field
            // var original = scope.contract_orig[field]
            // var current = scope.contract[field]
            scope.$watch(string, render, true);
            render()

            function render() {
                el.toggleClass('edited', scope.contract_orig[field] != scope.contract[field])
            }
        }
    };
});