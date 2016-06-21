/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('categoryCtrl', ['$scope', '$location', '$http', 'parseRating', '$q', 'getContent', function (scope, location, http, parseRating, $q, getContent) {
    scope.arrayProviders = getContent.service.data.data;
    scope.arrayTopics = getContent.topic.data.data;
    scope.arrayContent = getContent.content.data.data;
    scope.arrayLanguages = getContent.languages.data.data;
    scope.arrayLocations = getContent.locations.data.data;
    scope.freelancer = parseRating.rating(getContent.freelancer.data.data);
    scope.freelancer = parseRating.popularity(getContent.freelancer.data.data);
    scope.slider = {
        experience: {
            value: 3,
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
                }
            }
        }
    }

}]);