/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('CategoriesCtrl', ['$scope', '$location', '$http', 'parseRating', '$q', 'getContent', '$rootScope', '$stateParams', '$filter',
    function (scope, location, http, parseRating, $q, getContent, rootScope, stateParams, $filter) {
        scope.ownFilter = {}
        scope.arrayLanguages = getContent.languages.data.data;
        scope.arrayLocations = getContent.locations.data.data;
        scope.freelancers = [];
        scope.ownFilter.type = 'agency';

        scope.search = {}

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

        var checkValue = function (locSearch) {
            if (!locSearch) return
            var res = {};
            if (locSearch === Array)
                _.each(locSearch, function (i_e) {
                    res[i_e] = true;
                });
            else
                res[locSearch] = true;
            return res
        };

        if (stateParams.city) {
            scope.ownFilter.location = scope.ownFilter.location || {};
            scope.ownFilter.location = checkValue(stateParams.city);
        }

        scope.$watch('activeProvider', function (val) {
            if (val) {
                scope.submitFilter()
            }
        }, true)

        scope.submitFilter = function () {
            var filter = angular.copy(scope.ownFilter);
            if (filter.location)
                filter.location = objInArr(filter.location);
            filter.experience = scope.slider.experience.value;
            if (filter.location)
                filter.location = {$in: filter.location};

            if (rootScope.activeProvider && Object.keys(rootScope.activeProvider).length) {
                var t = {
                    "service_providers.type": rootScope.activeProvider.name
                };
                angular.forEach(rootScope.activeProvider, function (aPm, key) {
                    if (key == 'values')
                        angular.forEach(aPm, function (value) {
                            console.log(value)
                            if (value.arr)
                                angular.forEach(value.arr, function (aV) {
                                    if (aV.selected) {
                                        t['$or'] = t['$or'] || [];
                                        t['$or'].push({
                                            "service_providers.type": rootScope.activeProvider.name,
                                            "service_providers.filter": value.subFilter,
                                            "service_providers.name": aV.name
                                        })
                                    }
                                });
                            else if (value.selected) {
                                t['$or'] = t['$or'] || [];
                                t['$or'].push({
                                    "service_providers.type": rootScope.activeProvider.name,
                                    "service_providers.name": value.name
                                })
                            }
                        });
                });
                _.extend(filter, t)
            }

            // service_packages
            http.get('/api/freelancers?' + $.param(filter)).success(function (resp) {
                console.log('resp',resp)
                scope.freelancers = resp.data;
            })
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

XYZCtrls.controller('ViewProfileCtrl', ['$scope', '$location', '$q', 'getContent', '$http', '$stateParams', 'ModalService', 'payment', 'AuthService',
    function (scope, location, $q, getContent, $http, $stateParams, ModalService, payment, AuthService) {
        scope.viewsCount = getContent.viewsCount.data;
        scope.viewProfile = getContent.profile.data;
        scope.active_profile_menu = 'pricing';
        $http.get('/freelancer/rating', {params: {_id: $stateParams.id}}).then(function (resp) {
            scope.ratings = resp.data.data;
        });
        $http.get('/freelancer/review', {params: {_id: $stateParams.id}}).then(function (resp) {
            scope.reviews = resp.data.data;
        });
        if(scope.viewProfile.past_clients)
            scope.past_clients = scope.viewProfile.past_clients;
        $http.get('/api/freelancer/' + scope.viewProfile._id + '/jobs_count?status=ongoing').success(function (count) {
            scope.ongoingJobsCount = count
        });

        $http.get('/api/freelancer/' + scope.viewProfile._id + '/jobs_count?status=closed').success(function (count) {
            scope.closedJobsCount = count
        });

        scope.openExtra = function (pkg) {
            ModalService.showModal({
                templateUrl: "template/modal/extra.html",
                inputs: {
                    viewProfile: scope.viewProfile
                },
                controller: function ($scope, close, $element, viewProfile) {
                    $scope.viewProfile = viewProfile;
                    $scope.pkg = pkg;
                    $scope.extra_pkg = [];
                    $scope.total = function () {
                        var total = pkg.pricing;
                        _.each($scope.extra_pkg, function (ex) {
                            total += parseInt(ex.price);
                        })
                        return total;
                    };
                    $scope.payNow = function () {
                        payment($scope.total(), $scope.extra_pkg, $scope.pkg, viewProfile);
                    };
                    $scope.close = function (res) {
                        $element.modal('hide');
                        close(res, 500);
                    }

                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });
            });

        };

        $http.post('/api/freelancer/' + $stateParams.id + '/views');

        scope.checkFavorited = function () {
            $http.get('/api/freelancer/' + $stateParams.id + '/check_favorite').success(function (resp) {
                scope.profileFavorited = resp
            });
        };

        scope.showPic = function (pic) {
            console.log(pic);
            ModalService.showModal({
                templateUrl: "template/modal/workImg.html",
                controller: function ($scope, close, $element) {
                    $scope.pic = pic;

                    $scope.close = function (res) {
                        $element.modal('hide');
                        close(res, 500);
                    }
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });
            });

        };

        scope.addFavorite = function () {
            $http.get('/api/freelancer/' + scope.viewProfile._id + '/favorite/add');
            scope.profileFavorited = true
        };

        scope.removeFavorite = function () {
            $http.get('/api/freelancer/' + scope.viewProfile._id + '/favorite/remove');
            scope.profileFavorited = false
        };

    }]);
