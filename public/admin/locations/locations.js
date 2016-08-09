angular.module( 'admin.locations', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
]).config(function($stateProvider) {
    $stateProvider.state('locations', {
        url: '/locations',
        controller: 'LocationsCtrl',
        templateUrl: 'locations/locations.html',
        data: {
            requiresLogin: true,
            name: 'Locations'
        },
        resolve: {
            locations: function($http){
                return $http.get('/api/locations');
            }
        }
    });
})
    .controller( 'LocationsCtrl', function LocationsCtrl( $scope, $http, store, jwtHelper,locations,notify) {

        $scope.locations = locations.data;

        $scope.edit_space = {};

        $scope.edit_location = function(newName,oldname){
            if(!newName) return;
            var editParams = {
                query:{name:oldname},
                params:{name:newName}
            };
            $http.post('/admin/api/locations/',editParams).success(function (resp) {
                $scope.edit_space = {};
                notify({message: 'You have successfully update. \n Field:' + newName, duration: 3000, position: 'right', classes: "alert-success"});
            });
        };

        $scope.act_location = function(newName,cancel,remove){
            if(!newName) return;
            if(cancel) return  $scope.edit_space = {};
            var editParams = {
                params:{name:newName},
                isActive:true
            };
            if(remove){
                $http.delete('/admin/api/locations/'+angular.toJson(editParams.params)).success(function (resp) {
                    var index = $scope.locations.indexOf(remove);
                    $scope.locations.splice(index, 1);
                    notify({message: 'You have successfully delete. \n Field:' + newName, duration: 3000, position: 'right', classes: "alert-success"});
                });
            }
            else
            $http.post('/admin/api/locations/add',editParams).success(function (resp) {
                $scope.edit_space = {};
                $scope.locations.push({name:newName});
                notify({message: 'You have successfully Add. \n Field:' + newName, duration: 3000, position: 'right', classes: "alert-success"});
            });
        }

    });

