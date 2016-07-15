/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HomeCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'parseRating', 'ModalService', 'ngDialog', '$location', '$rootScope', '$state', 'AuthService',
    function (scope, location, http, $q, getContent, parseRating, ModalService, ngDialog, $location, $rootScope, $state, AuthService) {

    scope.currentFreelancer = AuthService.currentFreelancer
    scope.howItWorks= false;
    scope.mainPage= true;
    scope.cancelRegistration = function () {
        location.path('/')
    };

    scope.link = function (url) {
        location.path(url)
    };

    scope.favorites = [];
    http.get('/api/my/favorites').success(function(favorites){
        scope.favorites = favorites
    });

    scope.addFavorite = function(profileId){
        http.get('/api/freelancer/'+profileId+'/favorite/add');
        scope.favorites.push(profileId)
    };

    scope.removeFavorite = function(profileId){
        http.get('/api/freelancer/'+profileId+'/favorite/remove');
        scope.favorites.splice(scope.favorites.indexOf(profileId),1);
    };


    scope.jobs = getContent.jobs.data.data;
    scope.profiles = getContent.sellers.data.data;
    scope.profiles.rating = parseRating.popularity(scope.profiles.rating);
    scope.viewServiceProvider = function(item){
        ModalService.showModal({
            templateUrl: "template/modal/postJobOrViewService.html",
            controller: function($scope, $element, close){
                $scope.item = item;
                $scope.close = function(state){
                    $element.modal('hide');
                    close(state,500);
                }
            }
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
            case 'service_provider':
                var q = {
                    service_provider: item.displayTitle
                };
                if (scope.ctrl.city)
                    q.cities = scope.ctrl.city
                $rootScope.$state.go('categories', q);
                break;
            case 'filters':
                var q = {
                    service_provider: item.service_provider,
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