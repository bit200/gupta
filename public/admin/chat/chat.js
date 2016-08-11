angular.module('admin.chat', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
])
    .config(function ($stateProvider) {
        $stateProvider.state('chat', {
            url: '/chat',
            controller: 'ChatCtrl',
            templateUrl: 'chat/chat.html',
            data: {
                requiresLogin: true,
                name: 'Chat'
            },
            resolve: {
                getContent: ["$q", "$http", "$stateParams", function ($q, $http, $stateParams) {
                    return $q.all({
                 
                    })
                }]
            }
        });
    })

    .controller('ChatCtrl', function ChatController($scope, $http, store, jwtHelper, ModalService, getContent, notify) {
        $scope.getchats = function (skip, limit) {
            var _skip = ($scope.configPagination.currentPage - 1) * $scope.configPagination.countByPage;
            $http.get('/admin/api/all', {params: {model:'ChatRoom',query:{populate: 'job', limit:  $scope.configPagination.countByPage, skip: _skip}}}).then(function (resp) {
                $scope.chats = resp.data.data.data;
                if(resp.data.data.count != $scope.configPagination.totalCount) {
                    $scope.configPagination.totalCount = resp.data.data.count;
                    $scope.configPagination.currentPage = 1;
                }
                   
            }, function (err) {
                notify({message: 'Error request, try again', duration: 3000, position: 'right', classes: "alert-error"});
            })

        };

        $scope.cb = function (page) {
            $scope.getchats(page)
        };

        $scope.configPagination = {
            currentPage: 1,
            countByPage: 12,
            totalCount: 0
        };

        $scope.check = function (type) {
            $scope.getUsers()
        };
        
        function spliceItem(index){
            $scope.chats.splice(index, 1);
        }
        
        function update_table(){
            $scope.getchats()
        }
        
    
        $scope.reject = function (item, index, type) {
            ModalService.showModal({
                templateUrl: "delete_modal.html",
                controller: function ($scope, $element, $http) {
                    $scope.submit = function () {
                        spliceItem(index);
                        $http.delete('/admin/api/delete', {params: {model:'ChatRoom', _id: item._id}}).then(function(){
                            update_table();
                            $scope.close()
                        })
                    };
                    $scope.close = function (res) {
                        $element.modal('hide');
                        close(res, 500);
                    }
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            });
        };

        $scope.getInformation = function (user) {
            ModalService.showModal({
                templateUrl: "chat/chat.view.html",
                controller: function ($scope, $element, $http) {
                    $scope.chat = angular.copy(user);
                    $scope.delete = function(id, message){
                        $http.post('/admin/api/chat/message', {_id:id, message:{time:message.time, message:message.message}}).then(function (resp) {
                            update_table();
                            $scope.close()
                        })
                    };
                    $scope.submit = function (user) {
                        $http.post('/admin/api/change', {model:'Chat', item :user}).then(function (resp) {
                            update_table();
                            $scope.close()
                        })
                    };
                    $scope.close = function (res) {
                        $element.modal('hide');
                        close(res, 500);
                    }
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                });

            });
        }
    });
    
