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
                    scope.submitFilter();
                }

            }
        };
        scope.selectedCateogries = [];
        
        scope.toggleCategory = function(value){
            if (scope.selectedCateogries.indexOf(value)>-1)
                scope.selectedCateogries.splice(scope.selectedCateogries.indexOf(value));
            else
                scope.selectedCateogries.push(value)
            scope.submitFilter();
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
        //
        // scope.$watch('activeProvider', function(val){
        //     if (val){
        //         scope.submitFilter()
        //     }
        // }, true)

        scope.$watch('ownFilter', function(val){
            if (val && Object.keys(val).length)
                scope.submitFilter();
        }, true);

        scope.submitFilter = function () {
            var filter = angular.copy(scope.ownFilter);
            if (filter.location)
                filter.location = objInArr(filter.location);
            // filter.experience = scope.slider.experience.value;
            if (filter.locations){
                filter.locations = {$in: _.map(filter.locations, function(value,location){
                    return value ? location : false
                }).clean(false)};
                if (!filter.locations['$in'].length)
                    delete filter.locations
            }
            if (filter.languages){
                filter.languages = {$in: _.map(filter.languages, function(value,language){
                    return value ? language : false
                }).clean(false)};

                if (!filter.languages['$in'].length)
                    delete filter.languages
            }

            if (scope.selectedCateogries && scope.selectedCateogries.length)
                filter.category = {$in: scope.selectedCateogries}

            filter.budget = {$and: [
                {$gte: scope.slider.minValue},
                {$lte: scope.slider.maxValue}
            ]};
            // if (rootScope.activeProvider && Object.keys(rootScope.activeProvider).length){
            //     var t = {
            //         "service_providers.type": rootScope.activeProvider.name
            //     };
            //     angular.forEach(rootScope.activeProvider, function(aPm, key){
            //         if (key == 'values')
            //             angular.forEach(aPm, function(value){
            //                 if (value.arr)
            //                     angular.forEach(value.arr, function(aV){
            //                         if (aV.selected)
            //                             t['$or'].push({
            //                                 "service_providers.type": rootScope.activeProvider.name,
            //                                 "service_providers.filter": value.subFilter,
            //                                 "service_providers.name": aV.name
            //                             })
            //                     });
            //                 else if (value.selected)
            //                     t['$or'].push({
            //                         "service_providers.type": rootScope.activeProvider.name,
            //                         "service_providers.name": value.name
            //                     })
            //             });
            //     });
            //     _.extend(filter, t)
            // }

            console.log(filter)
            http.get('/api/jobs?'+ $.param(filter)).success(function (resp) {
                scope.projects = resp.data;
            })
        };
        scope.submitFilter()



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
