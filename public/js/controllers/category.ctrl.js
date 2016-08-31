/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('CategoriesCtrl', ['$scope', '$location', '$http', 'parseRating', '$q', 'getContent', '$rootScope', '$stateParams', '$filter', 'ModalService', '$state',
    function (scope, location, http, parseRating, $q, getContent, rootScope, stateParams, $filter, ModalService, $state) {
        scope.ownFilter = {}
        scope.arrayLanguages = getContent.languages.data.data;
        scope.arrayLocations = getContent.locations.data.data;
        scope.freelancers = [];
        scope.loading = true;
        scope.ownFilter.type = 'agency';
        scope.search = {};
        scope.favorites = [];
        http.get('/api/my/favorite').success(function (favorites) {
            scope.favorites = favorites;
        });
        scope.firstInit = 0;
        if (!scope.firstInit) {
            angular.forEach(rootScope.commonFilters, function (values, key) {
                if (key == createServiceProviderUlr(stateParams.type)) {
                    rootScope.activeProvider = {
                        name: key,
                        values: values
                    };
                }

            });
            if (createServiceProviderUlr(stateParams.filter)) {
                rootScope.activeProvider.subName = createServiceProviderUlr(stateParams.filter)
            }
            ;
            scope.firstInit = 1;
        }
        scope.addFavorite = function (profileId) {
            http.get('/api/freelancer/' + profileId + '/favorite/add').then(function () {
                scope.favorites.push(profileId)
            }, function (err) {
                if (err.status == 401) {
                    $state.go('login')
                }
            });
        };


        scope.removeFavorite = function (profileId) {
            http.get('/api/freelancer/' + profileId + '/favorite/remove').then(function () {
                scope.favorites.splice(scope.favorites.indexOf(profileId), 1);
            })
        };
        scope.slider = {
            experience: {
                minValue: 0,
                maxValue: 15,
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
                        scope.ownFilter.experience = {'$gte': scope.slider.experience.minValue, '$lte': scope.slider.experience.maxValue};
                        scope.submitFilter(scope.ownFilter);
                    }
                }
            },
            rating: {
                minValue: 0,
                maxValue: 5,
                options: {
                    floor: 0,
                    ceil: 5,
                    step: 1,
                    showSelectionBar: true,
                    getPointerColor: function (value) {
                        return '#B9B6B9';
                    },
                    getSelectionBarColor: function (value) {
                        return '#B9B6B9';
                    },
                    translate: function (value) {
                        if (value < 2) {
                            return value + ' star'
                        }
                        if (value >= 2) {
                            return value + ' stars'
                        }
                    },
                    onEnd: function (r) {
                        scope.ownFilter.rating = {'$gte': scope.slider.rating.minValue, '$lte': scope.slider.rating.maxValue};
                        scope.submitFilter(scope.ownFilter);
                    }
                }
            },
            price_rating: {
                minValue: 0,
                maxValue: 5,
                options: {
                    floor: 0,
                    ceil: 5,
                    step: 1,
                    showSelectionBar: true,
                    getPointerColor: function (value) {
                        return '#B9B6B9';
                    },
                    getSelectionBarColor: function (value) {
                        return '#B9B6B9';
                    },
                    translate: function (value) {
                        if (value < 2) {
                            return value + ' star'
                        }
                        if (value >= 2) {
                            return value + ' stars'
                        }
                    },
                    onEnd: function (r) {
                        scope.ownFilter.price_rating = {'$gte': scope.slider.price_rating.minValue, '$lte': scope.slider.price_rating.maxValue};
                        scope.submitFilter(scope.ownFilter);
                    }
                }
            }
        };

        var checkValue = function (locSearch) {
            if (!locSearch) return;
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

        scope.showPic = function (pic) {
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


        // scope.$watch('activeProvider', function (val) {
        //         scope.submitFilter()
        // }, true);


        scope.submitFilter = function () {
            var filter = angular.copy(scope.ownFilter);
            if (filter.location) {
                filter.location = {$in:filter.location}
            }



            if (rootScope.activeProvider && Object.keys(rootScope.activeProvider).length) {
                var t = {
                    "service_providers.type": rootScope.activeProvider.name
                };
                angular.forEach(rootScope.activeProvider, function (aPm, key) {
                    if (key == 'values')
                        angular.forEach(aPm, function (value) {
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


            if (stateParams.type && stateParams.type.length) {
                var t = {
                    "service_providers.type": createServiceProviderUlr(stateParams.type)
                };
                if (stateParams.filter.length)
                    t["service_providers.name"] = createServiceProviderUlr(stateParams.filter)
            }

            _.extend(filter, t);
            http.get('/api/freelancers?' + $.param(filter)).success(function (resp) {
                scope.freelancers = scope.profiles = parseRating.views(resp.data);

                scope.loading = false;
            })
        };
        scope._sort = {};
        scope.sortBy = '';

        $state.current.ncyBreadcrumb.labelArr[3] = '/';
        $state.current.ncyBreadcrumb.labelArr[5]=$state.current.ncyBreadcrumb.labelArr[2]
        $state.current.ncyBreadcrumb.labelArr[2]=createServiceProviderUlr(stateParams.type);

        scope.sorting = function (text, name, model) {
            scope._sort[name] = model != true ? delete scope._sort[name] : text;
            scope.sortBy = _.without(_.toArray(scope._sort),true);
        };

        scope.keydown = function(ev){
            ev.stopPropagation();
        };


        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function createServiceProviderUlr(name) {
            if (name) {
                var arr = name.split('-');
                arr = _.map(arr, function (item) {
                    if (item != 'and') {
                        return capitalizeFirstLetter(item)

                    } else {
                        return item
                    }
                });
                return arr.join(' ')
            }
        }


        function objInArr(obj) {
            var arr = [];
            _.each(obj, function (value, key) {
                if (value) {
                    arr.push(key)
                }
            });
            return arr;
        }

        scope.submitFilter()
    }]);

XYZCtrls.controller('ViewProfileCtrl', ['$scope', '$location', '$q', 'getContent', '$http', '$stateParams', 'ModalService', 'payment', 'AuthService', '$state', 'notify',
    function (scope, location, $q, getContent, $http, $stateParams, ModalService, payment, AuthService, $state, notify) {
        scope.viewsCount = getContent.viewsCount.data;
        scope.viewProfile = getContent.profile.data;
        scope.questions = _.uniq(_.pluck(angular.copy(scope.viewProfile.service_providers), 'type'));
        $http.post('/api/questionnaire/registration', {type: 'register', service_provider: {'$in': scope.questions}}).then(function (resp) {
            scope.questionnaire = resp.data.data
            console.log('adasdasdas', scope.questionnaire);
        }, function (err) {
            notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
        });
        scope.active_profile_menu = 'pricing';
        scope.loading = true;
        $http.get('/freelancer/rating', {params: {_id: $stateParams.id}}).then(function (resp) {
            scope.ratings = resp.data.data;
        });

        scope.rows = function (item, num) {
            if (num)
                item.row_number = new Array(num);
        };
        $http.get('/freelancer/review', {params: {_id: $stateParams.id}}).then(function (resp) {
            scope.reviews = resp.data.data;
            scope.reviews = resp.data.data;
        });
        if (scope.viewProfile.past_clients)
            scope.past_clients = scope.viewProfile.past_clients;
        $http.get('/api/freelancer/' + scope.viewProfile._id + '/jobs_count?status=ongoing').success(function (count) {
            scope.ongoingJobsCount = count;
            scope.loading = false;
        });

        $http.get('/api/freelancer/' + scope.viewProfile._id + '/jobs_count?status=closed').success(function (count) {
            scope.closedJobsCount = count;
            scope.loading = false;
        });

        scope.createChat = function (id, name) {
            if (AuthService.isLogged()) {
                $http.post('/api/create/chat', {params: {buyer: AuthService.userId(), seller: id, name: name}}).then(function (resp) {
                    localStorage.setItem('currentChat', resp.data.data._id);
                    $state.go('messages', {_id: resp.data.data._id});
                })
            } else {
                $state.go('login')
            }
        };

        scope.replaceAlt = function (str) {
            return str.replace('&', ', ');
        };
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
                        });
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
