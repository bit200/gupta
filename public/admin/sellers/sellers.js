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
                    return $http.get('/admin/api/sellers?registrationStatus=0');
                }
            }
        });
    })
    .controller( 'SellersCtrl', function SellersController( $scope, $http, store, jwtHelper, sellers, ModalService, cfpLoadingBar, notify) {
        $scope.sellers = sellers.data;
        $scope.seller_area = {};

        $scope.selectFilter = 'pending';

        $scope.changeFilter = function(selectFilter){
            var params = '';
            switch (selectFilter){
                case 'pending':
                    params = '?&registrationStatus=0';
                    break;
                case 'approved':
                    params = '?&registrationStatus=1';
                    break;
                case 'rejected':
                    params = '?&registrationStatus=2';
                    break;
            }
            $http.get('/admin/api/sellers'+params).success(function(sellers){
                $scope.sellers = sellers;
            });
        };

        $scope.profileDetails = function(id){
            $http.get('/admin/api/seller/'+id).then(function (resp) {
                ModalService.showModal({
                    templateUrl: "sellers/sellerDetail.modal.html",
                    controller: ['$scope', '$element', 'close', function (scope, $element, close) {
                        scope.profile = resp.data;
                        scope.close = function(){
                            $element.modal('hide');
                            close(null, 400)
                        };
                    }]
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                    });

                });
            });
        };
        $scope.reject = function(seller, $index){
            $scope.seller_area.rejectedItemIndex = $index;
            ModalService.showModal({
                templateUrl: "sellers/reject.modal.html",
                controller: ['$scope', '$element', 'close', function (scope, $element, close) {
                    scope.seller = seller
                    scope.submit = function(invalid, rejectReason){
                        if (invalid) return
                        scope.close(rejectReason)
                    }
                    scope.close = function(reject_reason){
                        $element.modal('hide');
                        close(reject_reason, 500)
                    };
                }]
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (rejected_reason) {
                    $scope.seller_area.rejectedItemIndex = undefined;
                    if (rejected_reason){
                        $scope.rejectApproveProfile('reject',seller._id, $index, {reject_reason: rejected_reason})
                    }
                });
            });
        };
        
        $scope.rejectApproveProfile = function(status, sellerId, $index, body){
            cfpLoadingBar.start();
            console.log(body)
            $http.post('/admin/api/registration/'+status+'/'+sellerId, body || {}).success(function(){
                cfpLoadingBar.complete()
                notify({message: 'Seller with id ' + sellerId + ' has been succesfully '+ (status == 'reject' ? 'rejected' : 'approved'), position: 'right'});
                $scope.sellers.splice($index,1)
            })
        };
    });
