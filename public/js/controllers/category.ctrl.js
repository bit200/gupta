/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('categoryCtrl', ['$scope', '$location', '$http', '$routeParams', 'parseRating', '$q', 'getContent', 'ModalService', function (scope, location, http, routeParams, parseRating, $q, getContent, ModalService) {
    scope.ownFilter = {}
    scope.arrayProviders = getContent.service.data.data;
    scope.arrayTopics = getContent.topic.data.data;
    scope.arrayContent = getContent.content.data.data;
    scope.arrayLanguages = getContent.languages.data.data;
    scope.arrayLocations = getContent.locations.data.data;
    scope.freelancer = parseRating.rating(getContent.freelancer.data.data);
    scope.freelancer = parseRating.popularity(getContent.freelancer.data.data);
    scope.ownFilter.agency = true;
    scope.ownFilter.freelancer = true;
    if (routeParams)
        scope.mainSearch = {name: routeParams.filter}
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
        http.get('/freelancer', {params: filter}).then(function (resp) {
            filter = {};
            scope.freelancer = parseRating.rating(resp.data.data);
            scope.freelancer = parseRating.popularity(resp.data.data);
        }, function (err) {
        })
    };

    scope.showProfile = function (id) {
        http.get('/freelancer', {params:{_id: id}}).then(function(resp){
            ModalService.showModal({
                templateUrl: "template//modal/modalSeller.html",
                controller: function ($scope) {
                    $scope.profile = parseRating.rating(resp.data.data)[0];
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            });
        });
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