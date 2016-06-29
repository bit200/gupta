/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('categoryCtrl', ['$scope', '$location', '$http', 'parseRating', '$q', 'getContent', 'ModalService', '$route', '$location',
    function (scope, location, http, parseRating, $q, getContent, ModalService, $route, $location) {
    scope.ownFilter = {}
    scope.arrayTopics = getContent.topic.data.data;
    scope.arrayContent = getContent.content.data.data;
    scope.arrayLanguages = getContent.languages.data.data;
    scope.arrayLocations = getContent.locations.data.data;
    scope.arrayProviders = getContent.arrayProviders.data.data;
    scope.freelancers = [];
    scope.ownFilter.agency = true;
    scope.ownFilter.freelancer = true;


    scope.setActiveProvider = function(provider){
        scope.ownFilter.freelancer_type = provider;
        scope.submitFilter(scope.ownFilter)
        $location.search({provider: provider})
    };
    if ($location.search().provider)
        scope.ownFilter.freelancer_type = $location.search().provider;
        
    scope.slider = {
        experience: {
            value: 0,
            options: {
                floor: 0,
                ceil: 15,
                step: 1,
                showSelectionBar: true,
                getPointerColor: function (value) {
                    return '#B9B6B9';
                },
                getSelectionBarColor: function (value) {
                    return '#B9B6B9';
                },
                translate: function (value) {
                    if (value == 0) {
                        return value
                    }
                    if (value == 1) {
                        return value + ' year'
                    }
                    if (value == 15) {
                        return value + '+ year'
                    }
                    return value + ' years';
                },
                onEnd: function (r) {
                    scope.submitFilter(scope.ownFilter); // logs 'on end slider-id'
                }
            }
        }
    };

    scope.submitFilter = function (data) {
        var filter = angular.copy(data);
        if (filter.industry_expertise)
            filter.industry_expertise = objInArr(filter.industry_expertise);

        if (filter.freelancer && filter.agency) {
            delete filter.agency;
            delete filter.freelancer;
        }
        if (filter.agency)
            filter.type = 'agency';
        delete filter.agency;
        if (filter.freelancer)
            filter.type = 'freelancer';
        delete filter.freelancer;
        if (filter.content_type)
            filter.content_type = objInArr(filter.content_type);
        if (filter.languages)
            filter.languages = objInArr(filter.languages);
        if (filter.location)
            filter.location = objInArr(filter.location);
        filter.experience = scope.slider.experience.value;
        http.get('/api/freelancers?'+ $.param(filter)).then(function (resp) {
            filter = {};
            scope.freelancers = resp.data.data;
        }, function (err) {
        })
    };

    scope.submitFilter(scope.ownFilter);

    scope.showProfile = function (id) {
        scope.profileFavorited = false;
        scope.active_profile_menu = 'profile';
        http.post('/api/freelancer/'+id+'/views');
        http.get('/api/freelancer/'+id+'/views?days=90').success(function(viewsCount){
            scope.viewsCount = viewsCount
        });
        http.get('/api/freelancer/'+id).success(function(resp) {
            console.log(resp)
            scope.viewProfile = resp.data;
        });
    };

    scope.checkFavorited = function(){
        http.get('/api/freelancer/'+id+'/check_favorite').success(function (resp) {
            scope.profileFavorited = resp
        });
    };

    scope.addFavorite = function(){
        http.get('/api/freelancer/'+scope.viewProfile._id+'/favorite/add');
        scope.profileFavorited = true
    };

    scope.removeFavorite = function(){
        http.get('/api/freelancer/'+scope.viewProfile._id+'/favorite/remove');
        scope.profileFavorited = false
    };

    function objInArr(obj) {
        var arr = [];
        _.each(obj, function (value, key) {
            if (value) {
                arr.push(key)
            }
        });
        return arr;
    }

}]);