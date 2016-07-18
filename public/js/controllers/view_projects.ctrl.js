/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('ViewProjectsCtrl', ['$scope', '$location', '$http', 'parseRating', '$q', 'getContent', '$rootScope', '$stateParams', '$filter',
    function (scope, location, http, parseRating, $q, getContent, rootScope, stateParams, $filter) {
        scope.ownFilter = {}
        scope.arrayLanguages = getContent.languages.data.data;
        scope.arrayLocations = getContent.locations.data.data;
        scope.search = {}
        scope.projects = [];

        scope.slider = {
            minValue: 10,
            maxValue: 200,
            options: {
                floor: 10,
                ceil: 200,
                step: 10,
                minRange: 10,
                maxRange: 190,
                getPointerColor: function (value) {
                    return 'rgb(51, 57, 69)';
                },
                getSelectionBarColor: function (value) {
                    return 'rgb(51, 57, 69)';
                },
                translate: function (value) {
                    return value + 'K';
                },
                onEnd: function (r) {
                    // scope.submitFilter(scope.ownFilter);
                }

            }
        };
        scope.selectedCateogries = [];
        
        scope.toggleCategory = function(value){
            if (scope.selectedCateogries.indexOf(value)>-1)
                scope.selectedCateogries.splice(scope.selectedCateogries.indexOf(value));
            else
                scope.selectedCateogries.push(value)
        };

        scope.checkIfSelectedCategory = function(value){
            return scope.selectedCateogries.indexOf(value) > -1;
        };

        var checkValue = function(locSearch){
            if (!locSearch) return
            var res = {};
            if (locSearch === Array)
                _.each(locSearch, function(i_e){
                    res[i_e] = true;
                });
            else
                res[locSearch] = true;
            return res
        };

        if (stateParams.city){
            scope.ownFilter.location = scope.ownFilter.location || {};
            scope.ownFilter.location = checkValue(stateParams.city);
        }

        scope.$watch('activeProvider', function(val){
            if (val){
                scope.submitFilter()
            }
        }, true)

        scope.submitFilter = function () {
            var filter = angular.copy(scope.ownFilter);
            if (filter.location)
                filter.location = objInArr(filter.location);
            // filter.experience = scope.slider.experience.value;
            if (filter.location)
                filter.location = {$in: filter.location};

            console.log(filter)
            if (rootScope.activeProvider && Object.keys(rootScope.activeProvider).length){
                var t = {
                    "service_providers.type": rootScope.activeProvider.name
                };
                angular.forEach(rootScope.activeProvider, function(aPm, key){
                    if (key == 'values')
                        angular.forEach(aPm, function(value){
                            if (value.arr)
                                angular.forEach(value.arr, function(aV){
                                    if (aV.selected)
                                        t['$or'].push({
                                            "service_providers.type": rootScope.activeProvider.name,
                                            "service_providers.filter": value.subFilter,
                                            "service_providers.name": aV.name
                                        })
                                });
                            else if (value.selected)
                                t['$or'].push({
                                    "service_providers.type": rootScope.activeProvider.name,
                                    "service_providers.name": value.name
                                })
                        });
                });
                _.extend(filter, t)
            }
            // http.get('/api/jobs?'+ $.param(filter)).success(function (resp) {
            //     scope.projects = resp.data;
            // })
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
