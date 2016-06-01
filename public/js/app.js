'use strict';

/* App Module */

var XYZApp = angular.module('XYZApp', [
    'ngRoute',
    'XYZCtrls'
]);

XYZApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/registration', {
                templateUrl: 'template/registration.html',
                controller: 'MainCtrl'
            })
            .when('/', {
                templateUrl: 'template/login.html',
                controller: 'MainCtrl'
            })
            .when('/home', {
                templateUrl: 'template/home.html',
                controller: 'MainCtrl'
            })
    }]);
