var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('loginCtrl', ['$scope', '$http', 'AuthService', '$state', 'loginSocial', function ($scope, $http, AuthService, $state, loginSocial) {
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
    $scope.login_google = function () {
        var element = (document.getElementById('customBtn'));
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.attachClickHandler(element, {},
            function (googleUser) {
                loginSocial(googleUser.wc.hg, googleUser.wc.Za, googleUser.wc.Na, googleUser.wc.Ph)
            }, function (error) {
            });
    }

    $scope.LinkedIn = function () {
        if (IN.User.isAuthorized()) {
            // IN.API.Raw("/people/~").result(function (resp) {
            //     console.log('resp', resp)
            // }).error(function (err) {
            //     console.log('err', err)
            // });
            IN.API.Profile("me").fields("first-name", "last-name", "email-address", "picture-url").result(function (data) {
                var user = data.values[0];
                loginSocial(user.emailAddress, user.firstName, user.lastName, user.pictureUrl || ' ');
            }).error(function (data) {
            });
        } else {
            IN.User.authorize(function () {
                IN.API.Profile("me").fields("first-name", "last-name", "email-address").result(function (data) {
                    var user = data.values[0];
                    loginSocial(user.emailAddress, user.firstName, user.lastName, user.pictureUrl || ' ');
                }).error(function (data) {
                    console.log(data);
                });
            }, {});
        }

    };

    $scope.login = function () {
        FB.login(function (response) {
            if (response.status === 'connected') {
                FB.api('/me?fields=id,email,name,picture', function (data) {
                    var name = data.name.split(' ');
                    loginSocial(data.email, name[0], name[1], data.picture.data.url)
                })
            }
        }, {scope: 'email'});
    };
    


}]);
