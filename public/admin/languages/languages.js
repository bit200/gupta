angular.module( 'admin.languages', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
]).config(function($stateProvider) {
        $stateProvider.state('languages', {
            url: '/languages',
            controller: 'LanguagesCtrl',
            templateUrl: 'languages/languages.html',
            data: {
                requiresLogin: true,
                name: 'Languages'
            },
            resolve: {
                languages: function($http){
                    return $http.get('/api/languages');
                }
            }
        });
    })
    .controller( 'LanguagesCtrl', function LanguagesCtrl( $scope, $http, store, jwtHelper,languages,notify) {

        $scope.languages = languages.data;
        console.log($scope.languages);
        $scope.edit_space = {};

        $scope.edit_language = function(newName,oldname){
            if(!newName) return;
            var editParams = {
                query:{name:oldname},
                params:{name:newName}
            };
            $http.post('/admin/api/languages/',editParams).success(function (resp) {
                $scope.edit_space = {};
                notify({message: 'You have successfully update. \n Field:' + newName, duration: 3000, position: 'right', classes: "alert-success"});
            });
        };

        $scope.act_language = function(newName,cancel,remove){
            if(!newName) return;
            if(cancel) return  $scope.edit_space = {};
            var editParams = {
                params:{name:newName},
                isActive:true
            };
            if(remove){
                $http.delete('/admin/api/languages/'+angular.toJson(editParams.params)).success(function (resp) {
                    var index = $scope.locations.indexOf(remove);
                    $scope.locations.splice(index, 1);
                    notify({message: 'You have successfully delete. \n Field:' + newName, duration: 3000, position: 'right', classes: "alert-success"});
                });
            }
            else
                $http.post('/admin/api/languages/add',editParams).success(function (resp) {
                    $scope.edit_space = {};
                    $scope.locations.push({name:newName});
                    notify({message: 'You have successfully Add. \n Field:' + newName, duration: 3000, position: 'right', classes: "alert-success"});
                });
        }

    });

