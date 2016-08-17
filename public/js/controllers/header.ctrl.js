var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HeaderCtrl', ['$scope', '$location', '$http', 'ModalService', '$rootScope', 'AuthService', 'socket', 'breadCrumbs', '$state', '$q',
    function (scope, $location, http, ModalService, $rootScope, AuthService, socket, breadCrumbs, $state, $q) {
        scope.logout = AuthService.logout;
        //scope.showAuth = AuthService.showLogin;
        scope.showAuth = function (text) {
            $location.path('/' + text)
        };
        scope.filtersArr = [];
        angular.forEach($rootScope.commonFilters,function(item,key){
            var a = {
                title:key,
                data:item,
                order:item[0].order>=0?item[0].order:100
            };
            scope.filtersArr.push(a);
        });


        scope.arrayProviders = [];
        http.get('/get-content', {
            params: {
                name: 'ServiceProvider',
                query: {},
                distinctName: 'name'
            }
        }).then(function (resp) {
            scope.arrayProviders = resp.data.data;
            scope.isFreelancer = AuthService.currentFreelancer() ? true : false

        }, function (err) {
        });

        scope.getKey = function (obj) {
            return Object.keys(obj)[0]
        };
        var id = AuthService.userId();
        
        socket.emit('i online', id);
        setInterval(function () {
            socket.emit('ping online', id)
        }, 5000);

        scope.ctrl = {};

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



        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                scope.ctrl.searchText=''
                scope.subway = breadCrumbs.returnWay(toState.name, $rootScope.asView && $rootScope.asView.buyer ? 'Buyer' : 'Seller')
            })
    }]);
