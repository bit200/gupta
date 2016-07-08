XYZCtrls.controller('myProfileCtrl', ['$scope', '$location', '$http', '$q', 'notify', '$rootScope', 'AuthService', 'Upload',
    function (scope, location, http, $q, notify, $rootScope, AuthService, Upload) {
        scope.viewSellerProfile = false;
        scope.viewSeller = function(typeUser){
            scope.viewSellerProfile = !typeUser;
        }
    }]);