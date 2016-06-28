angular.module( 'admin').directive('ngConfirmClick', ['ngDialog', '$sce' ,function(ngDialog,$sce){
        return {
            priority: -1,
            restrict: 'A',
            link: function(scope, element, attrs){
                element.bind('click', function(e){
                    ngDialog.open({
                        template: 'components/confirm.html', 
                        className: 'ngdialog-theme-default',
                        controller: ['$scope', function($scope){
                            $scope.message = $sce.trustAsHtml(attrs.ngConfirmClick);
                        }],
                        preCloseCallback:function(res){
                            if (res == 'confirm') scope.$eval(attrs.ngConfirmAction);
                        }
                    });
                });
            }
        }
    }
]);