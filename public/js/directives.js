'use strict';

/* Directives */
XYZCtrls.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

XYZCtrls.directive('shakeThat', ['$animate', function ($animate) {

    return {
        require: '^form',
        scope: {
            submit: '&',
            submitted: '='
        },
        link: function (scope, element, attrs, form) {
            // listen on submit event
            element.on('submit', function () {
                // tell angular to update scope
                scope.$apply(function () {
                    // everything ok -> call submit fn from controller
                    //console.log(form.$invalid);
                    console.log(scope.errL);
                    scope.$watch(function () {
                        return form.$invalid
                    }, function (newElement, oldElement) {

                        //element.find('input').removeClass('shake')
                        if (newElement) {
                            element.find('input').addClass('shake')

                            scope.submitted = true;
                            //setTimeout(function () {
                            //
                            //    element.find('input').addClass('shake')
                            //
                            //})
                        }

                    });

                });
            });
        }
    };

}]);

XYZCtrls.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    text = text.toString();
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }

            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
XYZCtrls.directive('phoneNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9,+,-,-,(,)]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }

            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

XYZCtrls.directive("passwordVerify", function () {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(function () {
                var combined;

                if (scope.passwordVerify || ctrl.$viewValue) {
                    combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function (value) {
                if (value) {
                    ctrl.$parsers.unshift(function (viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
});

XYZCtrls.directive('uniqueUsername', function ($http) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('blur', function (e) {
                if (element.val().length < 4) return;
                ngModel.$loading = true;

                $http.get("/api/checkUnique?username=" + element.val()).success(function (data) {
                    ngModel.$loading = false;
                    ngModel.$setValidity('unique', !data.count);
                });
            });
        }
    };
})
XYZCtrls.directive('toggle', function() {
    return {
        scope: {
            toggle: '='
        },
        link: function(scope, elem, attrs) {
            scope.$watch('toggle', function(val){
                if (typeof val === 'boolean')
                    elem.slideToggle();
            })
        }
    }
});
