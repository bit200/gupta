/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('AgencyCtrl', ['$scope', '$location', '$http', 'parseType', '$q', 'getContent', 'ModalService', 'AuthService', '$filter',
    function (scope, location, http, parseType, $q, getContent, ModalService, AuthService, $filter) {
    scope.current_user = AuthService.currentUser();
    scope.agencies_area = {};
    scope.agencies = [];
    scope.businessAccounts = getContent.businessAccounts.data || [];
    scope.searchObj = {};

    var locations = getContent.locations.data.data;

    scope.configPagination = {
        totalCount: getContent.totalCount.data,
        currentPage: location.search().page,
        countByPage: 10
    };
    scope.cb = function(currentPage){
        http.get('/api/freelancers?page='+currentPage).success(function(resp){
            console.log(resp.data)
            scope.agencies = resp.data;
        })
    };

    scope.cb(0);

    scope.ctrl = {};

    scope.ctrl.selectedItemChange = function(item){
        if (!item) return scope.ctrl.selectedAgency = '';
        http.get('/api/freelancer/'+item._id).success(function(resp){
            scope.ctrl.selectedAgency = resp
        });
    };
    scope.ctrl.agencyNameSearch = function(text){
        var deferred = $q.defer();
        var query = '/api/freelancers/search?name='+text;
        if (scope.ctrl.city)
            query += '&city='+scope.ctrl.city;
        http.get(query).success(function(resp){
            scope.ctrl.selectedAgency = '';
            deferred.resolve(resp);
        });
        return deferred.promise;
    };

    scope.ctrl.selectedCityChange = function(city){
        scope.ctrl.city = city;
    };

    scope.ctrl.searchCity = function(text){
        return $filter('filter')(locations,text)
    };

    scope.claim = function (agency) {
        ModalService.showModal({
            templateUrl: "template/modal/claimForm.html",
            inputs: {
                agency: agency
            },
            controller: function ($scope, close, $element, agency) {
                $scope.agency = agency;
                $scope.sendRequest = function (invalid, claimData) {
                    if (invalid) return;
                    claimData.agency = agency._id; 

                    http.post('/api/claim_request', claimData).success(function (resp) {
                        $scope.close(resp);
                    })
                };
                $scope.close = function(res){
                    $element.modal('hide');
                    close(res, 500);
                }

            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result){
                    scope.businessAccounts.push(result);
                }
            });
        });

    };

}]);
