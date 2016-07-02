/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HomeCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'parseRating', 'ModalService', 'ngDialog', '$location', '$rootScope',
    function (scope, location, http, $q, getContent, parseRating, ModalService, ngDialog, $location, $rootScope) {

    scope.cancelRegistration = function () {
        location.path('/')
    };

    scope.link = function (url) {
        location.path(url)
    };

    scope.arrayProviders = getContent.freelancerType.data.data;
    scope.jobs = getContent.jobs.data.data;
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
                    $location.url(result)
            });

        });
    };

    scope.ctrl = {};
    scope.ctrl.selectedItemChange = function(item){
        switch (item.type) {
            case 'freelancers':
                $rootScope.$state.go('profile', {id: item._id});
                break;
            case 'jobs':
                $rootScope.$state.go('root.job_detailed', {id: item._id});
                break;
            case 'services':
                $rootScope.$state.go('categories', {
                    industry_expertises: [item.displayTitle]
                });
                break;
            case 'filters':
                break;
        }
    };

    scope.ctrl.search = function(text){
        var deferred = $q.defer();
        var query = '/api/search?query='+text;
        if (scope.ctrl.city)
            query += '&city='+scope.ctrl.city;
        http.get(query).success(function(resp){
            deferred.resolve((resp.freelancers || []).concat(resp.jobs || []).concat(resp.services || []).concat(resp.filters || []));
        });
        return deferred.promise;
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