angular.module( 'admin.categories', [
    'ui.router',
    'angular-storage',
    'angular-jwt'
]).config(function($stateProvider) {
        $stateProvider.state('categories', {
            url: '/categories',
            controller: 'CategoriesCtrl',
            templateUrl: 'categories/categories.html',
            data: {
                requiresLogin: true
            },
            resolve: {
                categories: function($http){
                    return $http.get('/api/common_filters');
                }
            }
        });
    })
    .controller( 'CategoriesCtrl', function CategoriesCtrl( $scope, $http, store, jwtHelper,categories,notify) {
        $scope.commonFilters = categories.data;

        $scope.filtersArr = [];
        angular.forEach(categories.data,function(item,key){
            var a = {
                title:key,
                data:item
            };
                $scope.filtersArr.push(a);
            });
        $scope.activeProvider = {};
        $scope.activeProvider.subName = ' ';
        $scope.activeProvider.subSubName = ' ';
        $scope.activeProvider.name = ' ';

        $scope.setSubMenu = function(filter){
            if($scope.activeProvider.subName == filter) return  $scope.activeProvider.subName = ' ';
                $scope.activeProvider.subName = filter;
        };
        $scope.setSubSubMenu = function(subV){
            $scope.activeProvider.subSubName = subV;
        };
        $scope.setActiveProvider = function(key, provider){
            if($scope.activeProvider.name == key) return  $scope.activeProvider.name = ' ';
            $scope.activeProvider = {
                name: angular.copy(key),
                values: angular.copy(provider)
            };
        };
        $scope.edit_space = {};

        $scope.addField = function(Filter,SubName,newField,cancel){
            if(cancel) return $scope.edit_space = {};
            var  addParams = {};
            if(!Filter && !newField) return ;
           if(SubName && newField){

               addParams = {
                   name:newField,
                   type:Filter||$scope.activeProvider.name,
                   subFilter:SubName,
                   filter:SubName,
                   isActive: true
               };
               if(Filter){
                   var frontParams = {
                       subFilter:SubName,
                       arr:[]
                   };
                   frontParams.arr.push(addParams);
                   $scope.commonFilters[Filter] = $scope.commonFilters[Filter] ||[];
                   $scope.commonFilters[Filter].push(frontParams);
               }else{

                   $scope.commonFilters[$scope.activeProvider.name].forEach(function(item,index){
                       if (item.subFilter == SubName){
                           item.arr.push(addParams);
                       }
                   });

               }
           }
           else if(SubName){
               $scope.commonFilters[Filter] = $scope.commonFilters[Filter]||[];
                if($scope.edit_space.flSubFilter){
                    addParams = {
                        type: Filter,
                        subFilter:SubName,
                        filter:SubName,
                        arr:[]
                    };
                    $scope.commonFilters[Filter].push(addParams);
                }
                else{
                    addParams = {
                        name:SubName,
                        type:Filter,
                        filter:"",
                        isActive: true
                    };
                    $scope.commonFilters[Filter].push(addParams);
                }
            }
            else return $scope.edit_space.NoValid = true;
            $http.post('/admin/api/filter/add', addParams).success(function (resp) {
                $scope.edit_space = {};
                var resultField = newField||SubName||Filter;
                notify({message: 'You have successfully add. \n Field:' + resultField, duration: 3000, position: 'right', classes: "alert-success"});
            });
        };

        $scope.editField = function(Filter,SubName,newField,oldField,remove){
            if(remove && $scope.edit_space.is_edit) return $scope.edit_space.is_edit = '';

            var updateParams = {
                query:{},
                newParams:{}
            };
            var editType = '';

            if(SubName && newField){
                updateParams.query.type = $scope.activeProvider.name;
                updateParams.query.filter = SubName;
                updateParams.query.name = oldField;
                updateParams.newParams.name = newField;
                editType = 'SubSubName';
            }
            else if(SubName){
                updateParams.query.type = $scope.activeProvider.name;
                updateParams.query.filter = oldField;
                updateParams.newParams.filter = SubName;
                editType = 'SubFilter';
            }
            else if(newField){
                updateParams.query.type = $scope.activeProvider.name;
                updateParams.query.name = oldField;
                updateParams.query.filter = '';
                updateParams.newParams.name = newField;
                editType = 'SubName';
            }
            else if(Filter){
                updateParams.query.type = oldField;
                updateParams.newParams.type = Filter;
            }
            if(remove){
                //search for delete
                if(updateParams.query.name || updateParams.query.filter)
                    $scope.commonFilters[$scope.activeProvider.name].forEach(function(item,index){
                        if((editType == 'SubName') && (item.name == updateParams.query.name))
                            delete $scope.commonFilters[$scope.activeProvider.name][index];
                        else if((editType == 'SubSubName') && (updateParams.query.filter == item.subFilter))
                            item.arr.forEach(function(subSubName,_index){
                                if(subSubName.name == updateParams.query.name)
                                    delete $scope.commonFilters[$scope.activeProvider.name][index].arr[_index];
                            });
                        else if((editType == 'SubFilter') && (updateParams.query.filter == item.subFilter)){
                            delete $scope.commonFilters[$scope.activeProvider.name][index];
                            if (!$scope.commonFilters[$scope.activeProvider.name].length)
                                 $scope.activeProvider = {};
                        }
                    });
                else
                    delete $scope.commonFilters[updateParams.query.type];
                $http.delete('/admin/api/filter/'+angular.toJson(updateParams.query)).success(function (resp) {
                    var resultField = newField||SubName||Filter;
                    notify({message: 'You have successfully delete. \n Field:' + resultField, duration: 3000, position: 'right', classes: "alert-success"});
                });
            }
            else
                $http.post('/admin/api/filter/',updateParams).success(function (resp) {
                    var resultField = newField||SubName||Filter;
                    notify({message: 'You have successfully update. \n Field:' + resultField, duration: 3000, position: 'right', classes: "alert-success"});
                });
        };
    });
