/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HomeCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'parseRating', 'ModalService', 'ngDialog', '$location', '$rootScope', '$state',
    function (scope, location, http, $q, getContent, parseRating, ModalService, ngDialog, $location, $rootScope, $state) {


    scope.howItWorks= false;
    scope.mainPage= true;
    scope.cancelRegistration = function () {
        location.path('/')
    };

    scope.link = function (url) {
        location.path(url)
    };

    scope.jobs = getContent.jobs.data.data;
    scope.profiles = parseRating.rating(getContent.sellers.data.data);
    scope.profiles = parseRating.popularity(scope.profiles);
    scope.viewServiceProvider = function(item){
        ModalService.showModal({
            templateUrl: "template/modal/postJobOrViewService.html",
            controller: ['$scope', '$element', 'close', function($scope, $element, close){
                $scope.item = item;
                $scope.close = function(state){
                    $element.modal('hide');
                    close(state,500);
                }
            }]
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (state) {
                if (state)
                    $state.go(state.name, state.params)
            });

        });
    };

    scope.locations = getContent.locations.data.data;
    scope.ctrl = {};

    scope.ctrl.selectedItemChange = function(item){
        if (!item) return;
        switch (item.type) {
            case 'freelancers':
                $rootScope.$state.go('profile', {id: item._id});
                break;
            case 'jobs':
                $rootScope.$state.go('root.job_detailed', {id: item._id});
                break;
            case 'service_providers':
                var q = {
                    service_providers: [item.displayTitle]
                };
                if (scope.ctrl.city)
                    q.cities = scope.ctrl.city
                $rootScope.$state.go('categories', q);
                break;
            case 'filters':
                var q = {
                    service_providers: [item.service_provider],
                    filters: [item.filter_name]
                };
                if (scope.ctrl.city)
                    q.cities = [scope.ctrl.city]
                $rootScope.$state.go('categories', q);
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