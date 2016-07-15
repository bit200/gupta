/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('JobsContentCtrl', ['$scope','getContent', '$rootScope', 'jobInformation', function(scope,getContent, $rootScope, jobInformation){
    scope.categories = [];
    scope.subCategories = [];

    scope.onSelectCustom = function(item){
        scope.subCategories = _.map(angular.copy($rootScope.commonFilters[item]), function(it){
            return it.name
        });
    };

    $rootScope.search;
    scope.slider = {
        minValue: 1000,
        maxValue: 50000,
        options: {
            floor: 0,
            ceil: 100000,
            step: 1,
            noSwitching: true,
            showSelectionBar: true,
            getPointerColor: function (value) {
                return '#353B47';
            },
            getSelectionBarColor: function (value) {
                return '#353B47';
            },
            translate: function (value) {
                if (value < 1000) {
                    return value
                }
                if (value < 1000000) {
                    return value / 1000 + 'k'
                }
            },
            onEnd: function (r) {
                console.log('slide', scope.slider.value)
                jobInformation.setInfo({budget_min:scope.slider.minValue, budget_max: scope.slider.maxValue})
            }
        }
    };
    $rootScope.$watchCollection('commonFilters', function(val){
        if (val)
            scope.categories = Object.keys(val)
    });
}]);

XYZCtrls.controller('ViewMyJobCtrl', ['$scope','$http', 'info', '$rootScope', '$q', 'getContent', function (scope, $http, info, rootScope, $q, getContent) {
    var user_type = info.user_type;
    var job_type = info.job_type;
    info.template = info.template || [user_type, job_type].join('-');
    info.header = info.header || job_type + ' jobs';
    info.url = info.url || ['/api', 'jobs', user_type, job_type].join('/');
    scope.info = info;
    rootScope.info = info;

}]);
