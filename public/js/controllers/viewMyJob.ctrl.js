/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('ViewMyJobCtrl', ['$scope', '$http', 'info', '$rootScope', '$q', 'getContent', '$state', function (scope, $http, _info, rootScope, $q, getContent, $state) {
    var user_type = _info.user_type;
    var job_type = _info.job_type;
    var info = angular.copy(_info);
    if ($state.current.name != 'jobs_list.all') {
        // info.user_type = rootScope.asView.buyer ? 'buyer' : 'seller';
    }
    info.template = info.template || [user_type, job_type].join('-');
    info.header = info.header || job_type + ' jobs';
    info.url = info.url || ['/api', 'jobs', user_type, job_type].join('/');
    scope.info = info;
    rootScope.info = info;
}]);

XYZCtrls.controller('JobsContentCtrl', ['$scope', '$http', 'getContent', '$rootScope', '$timeout', 'jobInformation', '$state', function (scope, http, getContent, $rootScope, $timeout, jobInformation, $state) {
    scope.categories = [];
    scope.subCategories = [];
    scope._keywords = '';
    scope.isSub = false;
    scope.searchJob = '';

    http.get('/get-content', {params: {name: 'Location', query: {}, distinctName: 'name'}}).then(function (resp) {
        scope.locations = resp.data.data
    });

    scope.onOpen = function (e, type) {
        if (type == 'category') {
            scope.category_open = !scope.category_open;
        }

        if (type == 'location') {
            scope.location_open = !scope.location_open;
        }
    };

    scope.selectItem = function (elem, type) {
        if (type == 'category') {
            scope.category_open = !scope.category_open;
            scope.selected_category = elem
        }
        if (type == 'location') {
            scope.location_open = !scope.location_open;
            scope.selected_location = elem
        }
        var obj = {};
        obj[type] = elem;
        jobInformation.setInfo(obj);
        scope.filterJob()
    };

    scope.searchText = function (text) {
        if (!text) {
            jobInformation.deleteSearch();
        } else {
            jobInformation.setInfo({search: text})
        }

        scope.filterJob()
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
        minValue: 1,
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
                jobInformation.setInfo({budget_min: scope.slider.minValue || 1, budget_max: scope.slider.maxValue});
                scope.filterJob()
            }
        }
    };

    scope.filterJob = function () {
        console.log('jobInformation', jobInformation.getInfo.information());
        http.get('/api/jobs/filter', {params: jobInformation.getInfo.information()}).then(function (resp) {
            scope.$broadcast('changeItems', resp.data.data)
        }, function (err) {
            console.log('err', err)
        })

    };

    scope.$watch('_keywords', function (e, val) {
        if (e) {
            jobInformation.setInfo({search: e})
        }
    });

    $rootScope.$watchCollection('commonFilters', function (val) {
        if (val)
            scope.categories = Object.keys(val)
    });
}
]);


