/* Controllers */
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('userCtrl', ['$scope', '$location', '$http', '$q', 'getContent', 'ngDialog', function (scope, location, http, $q, getContent, ngDialog) {
    scope.arrayProviders = getContent.service.data.data;
    scope.arrayTopics = getContent.topic.data.data;
    scope.user = getContent.user.data.data;
    ngDialog.open({
        template: 'templateId',
        className: 'ngdialog-theme-default',
        controller: function ctrl($scope) {
            $scope.test = function () {
                ngDialog.closeAll();
            }
        }
    });
    scope.socialNetworks = [
        {
            name: 'Facebook',
            model: 'facebook'
        }, {
            name: 'Twitter',
            model: 'twitter'
        }, {
            name: 'Google+',
            model: 'google'
        }, {
            name: 'LinkedIn',
            model: 'linkedin'
        }, {
            name: 'Instragram',
            model: 'instragram'
        }, {
            name: 'Flickr',
            model: 'flickr'
        }, {
            name: 'Pinterest',
            model: 'pinterest'
        }
    ];

    scope.closeMenu = function () {
        if (!scope.close.social) {
            scope.close.social = true;
        }
        else scope.close.social = false;
    }
    scope.slider = {
        video: {
            minValue: 20000,
            maxValue: 800000,
            options: {
                floor: 0,
                ceil: 1000000,
                step: 1,
                noSwitching: true,
                showSelectionBar: true,
                getPointerColor: function (value) {
                    return '#B9B6B9';
                },
                getSelectionBarColor: function (value) {
                    return '#B9B6B9';
                },
                translate: function (value) {
                    if (value < 1000) {
                        return value
                    }
                    if (value < 1000000) {
                        return value / 1000 + 'k'
                    }

                    return value / 1000000 + 'm';
                }
            }
        },
        web: {
            minValue: 20000,
            maxValue: 800000,
            options: {
                floor: 0,
                ceil: 1000000,
                step: 1,
                noSwitching: true,
                showSelectionBar: true,
                getPointerColor: function (value) {
                    return '#B9B6B9';
                },
                getSelectionBarColor: function (value) {
                    return '#B9B6B9';
                },
                translate: function (value) {
                    if (value < 1000) {
                        return value
                    }
                    if (value < 1000000) {
                        return value / 1000 + 'k'
                    }

                    return value / 1000000 + 'm';
                }
            }
        }
    }
}]);
