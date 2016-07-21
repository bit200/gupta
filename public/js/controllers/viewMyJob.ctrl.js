/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('ViewMyJobCtrl', ['$scope', '$http', 'info', '$rootScope', '$q', 'getContent', '$state', function (scope, $http, _info, rootScope, $q, getContent, $state) {

    var user_type = _info.user_type;
    var job_type = _info.job_type;
    var info = angular.copy(_info);
    if ($state.current.name != 'jobs_list.all'){
        info.user_type = rootScope.asView.buyer ? 'buyer' : 'seller';;
    }
    info.template = info.template || [user_type, job_type].join('-');
    info.header = info.header || job_type + ' jobs';
    info.url = info.url || ['/api', 'jobs', user_type, job_type].join('/');
    scope.info = info;
    rootScope.info = info;
}]);

XYZCtrls.controller('JobsContentCtrl', ['$scope', 'getContent', '$rootScope', '$timeout', 'jobInformation', function (scope, getContent, $rootScope, $timeout, jobInformation) {
    scope.categories = [];
    scope.subCategories = [];
    scope.subSubCategories = [];
    scope._keywords = '';
    scope.onSelectCustom = function (item) {
        scope.isSub = false;
        scope.subCategories = scope.parseFilter(angular.copy($rootScope.commonFilters[item]));
        $timeout(function(){ scope.isSub = true;},0);
        scope.isSubSub = false;
    };


    scope.onSelectSubCategory = function () {
        _.each($rootScope.commonFilters[jobInformation.getInfo.category()], function (item) {
            if (item.subFilter == jobInformation.getInfo.sub_category()) {
                scope.isSubSub = true;
                scope.subSubCategories = scope.parseFilter(item.arr)
            }
        })
    };
    scope.parseFilter = function (filters) {
        return _.map(filters, function (filter) {
            if (filter.subFilter) {
                scope.parseFilter(filter.arr);
                return filter.subFilter
            } else {
                return filter.name
            }
        })
    };
    scope.slider = {
        minValue: 1000,
        maxValue: 50000,
        options: {
            floor: 0,
            ceil: 100000,
            step: 500,
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
                jobInformation.setInfo({budget_min: scope.slider.minValue, budget_max: scope.slider.maxValue})
            }
        }
    };

    scope.$watch('_keywords', function(e,val){
        if(e){
            jobInformation.setInfo({search:e})
        }
    });
    
    $rootScope.$watchCollection('commonFilters', function (val) {
        if (val)
            scope.categories = Object.keys(val)
    });
}
]);


