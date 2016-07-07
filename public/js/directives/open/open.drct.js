XYZCtrls.directive('open', function () {
    return {
        restrict: 'AE',
        scope: true,
        controller: ['$scope', '$location', '$http', '$element', function (scope, $location, $http, $element) {
            console.log("$element", $element)
            var el = angular.element('<i class="fa fa-caret-down" aria-hidden="true"></i>')
            $element.append(el)
            $element.on('click', function(){
                scope.hidden = !scope.hidden
                $element.toggleClass('jhidden', scope.hidden)
                $element.next().toggleClass('jhidden', scope.hidden)
            })

        }]
    };
});