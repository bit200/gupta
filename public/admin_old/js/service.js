'use strict';

XYZAdminCtrls.service('AuthService', [ '$q', '$rootScope', 'ModalService', '$http', '$location',
    function($q, $rootScope, ModalService, $http, $location){
        var authTokens = {};
        var loggedIn = false, currentUser;

        var resObj = {
            setTokens: function(tokens){
                authTokens = tokens;
                localStorage.setItem('admin', JSON.stringify({
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                }));
                resObj.setCurrentUser();
                loggedIn = true;
                $http.defaults.headers.common['authorization'] = tokens.accessToken;
            },
            isLogged: function(){
                return loggedIn
            },
            currentUser: function(){
                return currentUser
            },
            logout: function(){
                currentUser = '';
                localStorage.clear();
                loggedIn = false;
                $rootScope.go('/login')
            },
            checkAuthCtrl: function () {
                var deferred = $q.defer();
                if (loggedIn) deferred.resolve();
                else {
                    deferred.reject()
                }
                return deferred.promise;
            },
            setCurrentUser: function(){
                currentUser = {};
                // $http.get('/me').success(function(resp){
                //     currentUser = resp.data
                // });
            }
        };
        if (localStorage.getItem('admin')){
            resObj.setTokens({
                accessToken: JSON.parse(localStorage.getItem('admin')).accessToken,
                refreshToken: JSON.parse(localStorage.getItem('admin')).refreshToken
            });
            loggedIn = true
        }

        return resObj
    }]);
