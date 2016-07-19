var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('loginCtrl', ['$scope', '$http', 'AuthService', '$state', function ($scope, $http, AuthService, $state) {
    $scope.signin = function (invalid, data) {
        $scope.loginError = '';
        if (invalid) return;
        $http.get('/sign-in', {params: {email: data.email, password: data.password}}).success(function (resp) {
            AuthService.setTokens({
                accessToken: resp.data.accessToken.value,
                refreshToken: resp.data.refreshToken.value
            });
            $state.go('home');
        }).error(function (err) {
            if (err.error == 'Item not found')
                $scope.loginError = 'User with this login not found';
            else
                $scope.loginError = 'Password not correct'
        });
    };
    console.log('sjfsj');

    $scope.LinkedIn = function () {
        $http.get('https://www.linkedin.com/oauth/v2/authorization', {params: {response_type: 'code', client_id: '78wfitxgu7t5gn', state: 'G4RRY3KryU2n1wsV', redirect_uri: 'http://localhost:8080', scope: 'r_basicprofile'}}).then(function (resp) {
            console.log('resp', resp)
        }, function (err) {
            console.log('err', err)
        })
    }

    $scope.login = function() {
        FB.login(function(response) {
            if (response.status === 'connected') {
                FB.api('/me?fields=id,email,name', function (data) {
                    console.log(data)
                })
            }
        }, {scope: 'email'});
    };

    $scope.$watch('userLinkedIn', function(e,data){
        console.log('asdzxvcxzcxzczcnvbnvgfhtryrty', e,data)
    })

    $scope.$on('event:google-plus-signin-success', function (event,authResult) {
        console.log('first', event, authResult)
    });
    $scope.$on('event:google-plus-signin-failure', function (event,authResult) {
        console.log('second', event, authResult)
    });


    $scope.me = function() {
        Facebook.api('/me', function(response) {
            $scope.user = response;
        });
    };
}]);
