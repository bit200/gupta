/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HomeCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'parseRating', 'ModalService', 'ngDialog', '$location', '$rootScope', '$state', 'AuthService', 'cfpLoadingBar',
    function (scope, location, http, $q, getContent, parseRating, ModalService, ngDialog, $location, $rootScope, $state, AuthService, cfpLoadingBar) {

        scope.currentFreelancer = AuthService.currentFreelancer;
        scope.howItWorks = false;
        scope.mainPage = true;
        scope.cancelRegistration = function () {
            location.path('/')
        };
        if($state.current.name == 'how_it_work'){
            scope.howItWorks = true;
            scope.mainPage = false;
        }


        scope.link = function (url) {
            location.path(url)
        };

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
                console.log(scope.favorites, profileId)
                scope.favorites.splice(scope.favorites.indexOf(profileId), 1);
            })
        };


        scope.jobs = getContent.jobs.data.data;
        scope.profiles = parseRating.views(getContent.sellers.data.data);
        scope.viewServiceProvider = function (item) {
            ModalService.showModal({
                templateUrl: "template/modal/postJobOrViewService.html",
                controller: function ($scope, $element, close) {
                    $scope.item = item;
                    $scope.close = function (state) {
                        $element.modal('hide');
                        close(state, 500);
                    }
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (state) {
                    if (state)
                        $state.go(state.name, state.params)
                });

            });
        };

        scope.locations = getContent.locations.data.data;
        scope.ctrl = {};

        scope.myInterval = 300000;


        scope.dataArray = [{
            src: '/img/face.png',
            text: '"Instead of hiring more engineers, we\'ve used Upwork as a more scalable solution that lets us ramp-up and down as needed."',
            title: 'Nick Greenfield',
            subTitle: 'Vice President of Marketing & Growth'
        },{
            src: '/img/face.png',
            text: '"Instead of hiring more engineers, we\'ve used Upwork as a more scalable solution that lets us ramp-up and down as needed."',
            title: 'Nick Greenfield',
            subTitle: 'Vice President of Marketing & Growth'
        },{
            src: '/img/face.png',
            text: '"Instead of hiring more engineers, we\'ve used Upwork as a more scalable solution that lets us ramp-up and down as needed."',
            title: 'Nick Greenfield',
            subTitle: 'Vice President of Marketing & Growth'
        }];

        scope.ctrl.selectedItemChange = function (item) {
            if (!item) return;
            switch (item.type) {
                case 'freelancers':
                    $rootScope.$state.go('profile', {id: item._id});
                    break;
                case 'jobs':
                    $rootScope.$state.go('root.job_detailed', {id: item._id});
                    break;
                case 'service_provider':
                    angular.forEach($rootScope.commonFilters, function (values, key) {
                        if (key == item.displayTitle) {
                            $rootScope.activeProvider = {
                                name: key,
                                values: values
                            };
                        }
                    });
                    if ($rootScope.asView.seller)
                        $rootScope.$state.go('view_projects', {city: scope.ctrl.city});
                    else
                        $rootScope.$state.go('categories', {city: scope.ctrl.city});
                    break;
                case 'filters':
                    angular.forEach($rootScope.commonFilters, function (values, key) {
                        if (key == item.service_provider) {
                            $rootScope.activeProvider = {
                                name: key,
                                values: values
                            };

                            if (item.filter_type) {
                                $rootScope.activeProvider.subName = item.filter_type;
                                $rootScope.activeProvider.subSubName = item.filter_name;
                            } else
                                $rootScope.activeProvider.subName = item.filter_name;
                        }
                    });
                    if ($rootScope.asView.seller)
                        $rootScope.$state.go('view_projects', {city: scope.ctrl.city});
                    else
                        $rootScope.$state.go('categories', {city: scope.ctrl.city});

                    break;
            }
        };

        scope.ctrl.search = function (text) {
            var deferred = $q.defer();
            var query = '/api/search?query=' + text;
            if (scope.ctrl.city)
                query += '&city=' + scope.ctrl.city;
            http.get(query).success(function (resp) {
                deferred.resolve((resp.freelancers || []).concat(resp.jobs || []).concat(resp.services || []).concat(resp.filters || []));
            });
            return deferred.promise;
        };

        scope.showProfile = function (id) {
            http.get('/api/freelancer/' + id).then(function (resp) {
                ModalService.showModal({
                    templateUrl: "template/modal/modalSeller.html",
                    controller: function ($scope) {
                        $scope.profile = parseRating.rating(resp.data.data)[0];
                        $scope.createChat = function (id) {
                        }
                    }
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                    });

                });
            });
        };
    }]);