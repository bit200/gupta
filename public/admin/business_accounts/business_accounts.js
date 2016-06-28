angular.module( 'admin.business_accounts', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function($stateProvider) {
        $stateProvider.state('business_accounts', {
            url: '/business_accounts',
            controller: 'BusinessAccountsCtrl',
            templateUrl: 'business_accounts/business_accounts.html',
            data: {
                requiresLogin: true
            },
            resolve: {
                business_accounts: function($http){
                    return $http.get('/admin/api/business_accounts?status=0');
                }
            }
        });
    })
    .controller( 'BusinessAccountsCtrl', function BusinessAccountsController( $scope, $http, store, jwtHelper, business_accounts, ModalService, cfpLoadingBar, notify) {
        $scope.business_accounts = business_accounts.data;

        $scope.showAgencyDetails = function(id){
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

        $scope.rejectApproveAccount = function(status, accId, $index){
            cfpLoadingBar.start()
            $http.get('/admin/api/business_accounts/'+status+'/'+accId).success(function(account){
                $scope.business_accounts.splice($index)
                cfpLoadingBar.complete()
                notify({message: 'Business account with id ' + accId + ' has been succesfully '+ (status == 'reject' ? 'rejected' : 'approved'), position: 'right'});
            });
        };

        $scope.business_accounts_area = {};
        
        $scope.reject = function(business_account, $index){
            $scope.business_accounts_area.rejectedItemIndex = $index;
            ModalService.showModal({
                templateUrl: "business_accounts/reject.modal.html",
                controller: ['$scope', '$element', 'close', function (scope, $element, close) {
                    scope.business_account = business_account
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
                    $scope.business_accounts_area.rejectedItemIndex = undefined;
                    if (rejected_reason){
                        $scope.rejectApproveAccount('reject',business_account._id, $index, {reject_reason: rejected_reason})
                    }
                });
            });
        };

        $scope.rejectApproveAccount = function(status, accId, $index, body){
            cfpLoadingBar.start()
            $http.post('/admin/api/business_accounts/'+status+'/'+accId, body || {}).success(function(account){
                $scope.business_accounts.splice($index)
                cfpLoadingBar.complete()
                notify({message: 'Business account with id ' + accId + ' has been succesfully '+ (status == 'reject' ? 'rejected' : 'approved'), position: 'right'});
            });
        };
    });
