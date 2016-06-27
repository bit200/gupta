angular.module( 'admin.sellers', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function($stateProvider) {
        $stateProvider.state('sellers', {
            url: '/sellers',
            controller: 'SellersCtrl',
            templateUrl: 'sellers/sellers.html',
            data: {
                requiresLogin: true
            },
            resolve: {
                sellers: function($http){
                    return $http.get('/admin/api/sellers');
                }
            }
        });
    })
    .controller( 'SellersCtrl', function SellersController( $scope, $http, store, jwtHelper, sellers, ModalService, cfpLoadingBar, notify) {
        $scope.sellers = sellers.data;

        $scope.profileDetails = function(id){
            $http.get('/admin/api/seller/'+id).then(function (resp) {
                ModalService.showModal({
                    templateUrl: "sellers/sellerDetail.modal.html",
                    controller: function ($scope) {
                        $scope.profile = resp.data;
                    }
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                    });

                });
            });
        };

        $scope.rejectApproveProfile = function(status, sellerId, $index){
            cfpLoadingBar.start()
            $http.get('/admin/api/registration/'+status+'/'+sellerId).success(function(){
                cfpLoadingBar.complete()
                notify({message: 'Seller with id ' + sellerId + ' has been succesfully '+ (status == 'reject' ? 'rejected' : 'approved'), position: 'right'});
                $scope.sellers.splice($index,1)
            })
        };
    });
