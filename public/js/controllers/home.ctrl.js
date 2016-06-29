/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HomeCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'parseRating', 'ModalService', 'ngDialog', '$location',
    function (scope, location, http, $q, getContent, parseRating, ModalService, ngDialog, $location) {

    scope.cancelRegistration = function () {
        location.path('/')
    };

    scope.link = function (url) {
        location.path(url)
    };

    scope.arrayProviders = getContent.service.data.data;
        console.log('asdas', getContent)
    scope.profiles = parseRating.rating(getContent.sellers.data.data);
    scope.profiles = parseRating.popularity(scope.profiles);

    scope.viewServiceProvider = function(item){
        ModalService.showModal({
            templateUrl: "template/modal/postJobOrViewService.html",
            controller: ['$scope', '$element', 'close', function($scope, $element, close){
                $scope.item = item;
                $scope.close = function(path){
                    $element.modal('hide');
                    close(path,500);
                }
            }]
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {console.log(result)
                if (result)
                    $location.path(result)
            });

        });
    };
        
    scope.showProfile = function (id) {
        http.get('/api/freelancer/'+id).then(function (resp) {
            ModalService.showModal({
                templateUrl: "template/modal/modalSeller.html",
                controller: function ($scope) {
                    $scope.profile = parseRating.rating(resp.data.data)[0];
                    $scope.createChat = function(id){
                    }
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            });
        });
    };
}]);