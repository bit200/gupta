/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('CategoriesCtrl', ['$scope', '$location', '$http', 'parseRating', '$q', 'getContent',
    function (scope, location, http, parseRating, $q, getContent) {
    scope.ownFilter = {}
    scope.arrayTopics = getContent.topic.data.data;
    scope.arrayContent = getContent.content.data.data;
    scope.arrayLanguages = getContent.languages.data.data;
    scope.arrayLocations = getContent.locations.data.data;
    scope.freelancers = [];
    scope.ownFilter.agency = true;
    scope.ownFilter.freelancer = true;

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

    scope.$watch('activeProvider', function(val){
        if (val)
            scope.ownFilter.freelancer_type = val;
        scope.submitFilter(scope.ownFilter);
    });



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

XYZCtrls.controller('ViewProfileCtrl', ['$scope', '$location', '$http', '$q', 'getContent', '$http', '$stateParams',
    function (scope, location, http, $q, getContent, $http, $stateParams) {
        scope.viewsCount = getContent.viewsCount.data;
        scope.viewProfile = getContent.profile.data.data;
        scope.active_profile_menu = 'profile';

        $http.post('/api/freelancer/'+$stateParams.id+'/views');

        scope.checkFavorited = function(){
            http.get('/api/freelancer/'+$stateParams.id+'/check_favorite').success(function (resp) {
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

    }]);
