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
            },
            rating: {
                value: 0,
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
                    onStart: function (r) {
                        if (!scope.checkRating)
                            scope.checkRating = 'more';
                    },
                    onEnd: function (r) {
                        scope.checkRating == 'more' ? scope.ownFilter.rating = {'$gte': scope.slider.rating.value} : scope.ownFilter.rating = {'$lte': scope.slider.rating.value};
                        scope.submitFilter(scope.ownFilter);
                    }
                }
            },
            views: {
                value: 0,
                options: {
                    floor: 0,
                    ceil: 25000,
                    step: 100,
                    showSelectionBar: true,
                    getPointerColor: function (value) {
                        return '#B9B6B9';
                    },
                    getSelectionBarColor: function (value) {
                        return '#B9B6B9';
                    },
                    onStart: function (r) {
                        if (!scope.checkViews)
                            scope.checkViews = 'more';
                    },
                    onEnd: function (r) {
                        scope.checkViews == 'more' ? scope.ownFilter.views = {'$gte': scope.slider.views.value} : scope.ownFilter.views = {'$lte': scope.slider.views.value};
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

        scope.submitFilter = function () {
            var filter = angular.copy(scope.ownFilter);
            if (filter.location)
                filter.location = objInArr(filter.location);
            filter.experience = scope.slider.experience.value;
            if (filter.location)
                filter.location = {$in: filter.location};

            if (scope.date && scope.date.start) {
                filter.created_at = filter.created_at || {};
                filter.created_at['$gte'] = scope.date.start
            }

            if (scope.date && scope.date.end) {
                filter.created_at = filter.created_at || {};
                filter.created_at['$lte'] = scope.date.end
            }

            if (scope.checkRating) {
                scope.checkRating == 'more' ? filter.rating = {'$gte': scope.slider.rating.value} : filter.rating = {'$lte': scope.slider.rating.value};
            }
            if (scope.checkViews) {
                scope.checkViews == 'more' ? filter.views = {'$gte': scope.slider.views.value} : filter.views = {'$lte': scope.slider.views.value};
            }
            console.log('stateParams', stateParams)
            if (stateParams.type.length) {
                var t = {
                    "service_providers.type": createServiceProviderUlr(stateParams.type)
                };
                if (stateParams.filter.length)
                    t["service_providers.name"] = createServiceProviderUlr(stateParams.filter)

                console.log('ttt', t)
                // angular.forEach(rootScope.activeProvider, function (aPm, key) {
                //     if (key == 'values')
                //         console.log('qeqeqwe', aPm)
                //         angular.forEach(aPm, function (value) {
                //             if (value.arr)
                //                 angular.forEach(value.arr, function (aV) {
                //                     if (aV.selected) {
                //                         t['$or'] = t['$or'] || [];
                //                         t['$or'].push({
                //                             "service_providers.type": rootScope.activeProvider.name,
                //                             "service_providers.filter": value.subFilter,
                //                             "service_providers.name": aV.name
                //                         })
                //                     }
                //                 });
                //             else if (value.selected) {
                //                 t['$or'] = t['$or'] || [];
                //                 t['$or'].push({
                //                     "service_providers.type": rootScope.activeProvider.name,
                //                     "service_providers.name": value.name
                //                 })
                //             }
                //         });
                // });
                // _.extend(filter, t)
            }

            // service_packages
            http.get('/api/freelancers?' + $.param(t)).success(function (resp) {
                //scope.freelancers = resp.data;
                scope.freelancers = scope.profiles = parseRating.views(resp.data);
                scope.loading = false;
            })
        };

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function createServiceProviderUlr(name) {
            var arr = name.split('-');
            arr = _.map(arr, function (item) {
                if (item != 'and') {
                    return capitalizeFirstLetter(item)

                } else {
                    return item
                }
            });
            console.log(arr.join(' '))
            return arr.join(' ')
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

XYZCtrls.controller('ViewProfileCtrl', ['$scope', '$location', '$q', 'getContent', '$http', '$stateParams', 'ModalService', 'payment', 'AuthService', '$state',
    function (scope, location, $q, getContent, $http, $stateParams, ModalService, payment, AuthService, $state) {
        scope.viewsCount = getContent.viewsCount.data;
        scope.viewProfile = getContent.profile.data;
        scope.questions = _.uniq(_.pluck(angular.copy(scope.viewProfile.service_providers), 'type'));
        $http.post('/api/questionnaire/registration', {type: 'register', service_provider: {'$in': scope.questions}}).then(function (resp) {
            scope.questionnaire = resp.data.data;
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
