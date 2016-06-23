/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');

XYZCtrls.controller('HomeCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'parseRating', 'ModalService', function (scope, location, http, $q, getContent, parseRating, ModalService) {

    scope.cancelRegistration = function () {
        location.path('/')
    };

    scope.link = function (url) {
        location.path(url)
    };

    scope.arrayProviders = getContent.service.data.data;
    scope.profiles = parseRating.rating(getContent.sellers.data.data);
    scope.profiles = parseRating.popularity(scope.profiles);


    scope.showProfile = function (id) {
        http.get('/freelancer', {params: {_id: id}}).then(function (resp) {
            ModalService.showModal({
                templateUrl: "template//modal/modalSeller.html",
                controller: function ($scope) {
                    $scope.profile = parseRating.rating(resp.data.data)[0];
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            });
        });
    };

    scope.jobs = [
        {
            'Job Title': 'Hard job',
            'Job Category': 'hard',
            'Job Specifics': 'Nothing',
            'Location Preference': '1 24rw r124rwrq',
            'Budget(max)': 20222
        },
        {
            'Job Title': 'Easy job',
            'Job Category': 'easy',
            'Job Specifics': 'Just do it',
            'Location Preference': 'i76iuy iy7iy',
            'Budget(max)': 9999999999999
        }
    ]

}]);