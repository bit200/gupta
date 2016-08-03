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
    .controller( 'CategoriesCtrl', function CategoriesCtrl( $scope, $http, store, jwtHelper,categories,notify,$filter) {
        $scope.commonFilters = categories.data;

        $scope.filtersArr = [];
        angular.forEach(categories.data,function(item,key){
            angular.forEach(item,function(data){
                data.filter_order = data.filter_order>=0?data.filter_order:1000
            });
            item = $filter('orderBy')(item, 'filter_order');
            var a = {
                title:key,
                data:item,
                order:item[0].order>=0?item[0].order:1000
            };
                $scope.filtersArr.push(a);
            });
        $scope.filtersArr = $filter('orderBy')($scope.filtersArr, 'order');
        //console.log($scope.filtersArr);
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

        $scope.addField = function(idx,Filter,SubName,newField,cancel){
            if(cancel) return $scope.edit_space = {};
            var  addParams = {};
    console.log(idx,Filter,SubName,newField,cancel);
           if(!Filter) return ;
           if(Filter && (!$scope.filtersArr[idx])) var mainCreate = true;
           if(SubName && newField){
               addParams = {
                   name:newField,
                   type:Filter||$scope.activeProvider.name,
                   subFilter:SubName,
                   filter:SubName,
                   isActive: true
               };
               if(Filter){
                   //console.log("Here");
                   var frontParams = {
                       subFilter:SubName,
                       arr:[]
                   };
                   frontParams.arr.push(addParams);
                   $scope.filtersArr[idx].data = $scope.filtersArr[idx].data ||[];
                   $scope.filtersArr[idx].data.push(frontParams);
               }else{
                   $scope.filtersArr[idx].data.forEach(function(item,index){
                       if (item.subFilter == SubName){
                           item.arr.push(addParams);
                       }
                   });
               }
           }
           else if(SubName && Filter && !(idx>=0) ){
               console.log('ALL')
                   $scope.filtersArr.push({title:Filter,data:[{type:Filter,name:SubName}]});
                   addParams = {
                       //name:SubName,
                       type:Filter,
                       filter:SubName,
                       isActive: true
                   }
               }
           else if(SubName){
               console.log('subbb')
               //$scope.filtersArr[idx].data = $scope.filtersArr[idx] ||[];
                //if($scope.edit_space.flSubFilter){
                //    addParams = {
                //        type: Filter,
                //        subFilter:SubName,
                //        filter:SubName,
                //        arr:[]
                //    };
                //    $scope.filtersArr[idx].data.push({type:Filter,name:SubName});
                //}
                //else{
                    addParams = {
                        //name:SubName,
                        type:Filter,
                        filter:SubName,
                        isActive: true
                    };
                    $scope.filtersArr[idx].data.push({type:Filter,name:SubName});
                //}
            }
           else if(Filter){
               console.log('Filter')
               addParams = {
                   type:Filter,
                   isActive: true
               };
               $scope.filtersArr.push({title:Filter, data:[]});
           }
            else return $scope.edit_space.NoValid = true;

            addParams.main = mainCreate;
            $http.post('/admin/api/filter/add', addParams).success(function (resp) {
                $scope.edit_space = {};
                var resultField = newField||SubName||Filter;
                notify({message: 'You have successfully add. \n Field:' + resultField, duration: 3000, position: 'right', classes: "alert-success"});
            });
        };

        $scope.moveItem = function(from, to,filter){
            //console.log(from,'>>>',from + to,filter);
            if (((from == 0) && (to<0)) || ((from == $scope.filtersArr.length-1) && (to>0))) return;
            var change_params ={};
            var tmp = {};

            if (!(filter>=0)){
                to = from + to;
                $scope.filtersArr[from].order = to;
                $scope.filtersArr[to].order = from;

                tmp = $scope.filtersArr[to];
                $scope.filtersArr[to] = $scope.filtersArr[from];
                $scope.filtersArr[from] = tmp;

                change_params ={
                    name_from: $scope.filtersArr[to].title,
                    name_to: $scope.filtersArr[from].title,
                    order_from: to,
                    order_to: from
                };

                $http.post('/admin/api/filter/order', change_params).success(function (resp) {
                    console.log(resp);
                });
            }else{
                if (((from == 0) && (to<0)) || ((from == $scope.filtersArr[filter].data.length-1) && (to>0))) return;
                to = from + to;
                $scope.filtersArr[filter].data[from].filter_order = to;
                $scope.filtersArr[filter].data[to].filter_order = from;

                tmp = $scope.filtersArr[filter].data[to];
                $scope.filtersArr[filter].data[to] = $scope.filtersArr[filter].data[from];
                $scope.filtersArr[filter].data[from] = tmp;

                change_params ={
                    type:$scope.filtersArr[filter].title,
                    name_from: $scope.filtersArr[filter].data[to].name,
                    name_to: $scope.filtersArr[filter].data[from].name,
                    order_from: to,
                    order_to: from
                };

                $http.post('/admin/api/filter/order', change_params).success(function (resp) {
                    console.log(resp);
                });
            }

        };

        $scope.editField = function(Filter,SubName,newField,oldField,main,remove,idx){
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
                //updateParams.query.name = oldField;
                //updateParams.query.filter = '';
                updateParams.query.filter = oldField;
                updateParams.newParams.filter = newField;
                editType = 'SubName';
            }
            else if(Filter){
                updateParams.query.type = oldField;
                updateParams.newParams.type = Filter;
            }

            if(remove){
                //return console.log('---',idx)
                //search for delete
                if(updateParams.query.name || updateParams.query.filter)
                    $scope.filtersArr[idx].data.forEach(function(item,index){
                        if((editType == 'SubName') && (item.name == updateParams.query.filter))
                            {   delete $scope.filtersArr[idx].data[index];
                                //console.log('Del',$scope.filtersArr[idx].data, index );
                            }
                        else if((editType == 'SubSubName') && (updateParams.query.filter == item.subFilter))
                            item.arr.forEach(function(subSubName,_index){
                                if(subSubName.name == updateParams.query.name)
                                { delete $scope.filtersArr[idx].data[index].arr[_index];
                                    //console.log('Del',$scope.filtersArr[idx].data[index].arr[_index]);
                                }
                            });
                        else if((editType == 'SubFilter') && (updateParams.query.filter == item.subFilter)){
                                { delete $scope.filtersArr[idx].data[index];
                                    //console.log('Del',$scope.filtersArr[idx].data[index]);
                                }
                            if (! $scope.filtersArr[idx].data.length)
                                 $scope.activeProvider = {};
                        }
                    });
                else
                    $scope.filtersArr.splice(idx,1);
                if(main) updateParams.query.main = true;
                $http.delete('/admin/api/filter/'+angular.toJson(updateParams.query)).success(function (resp) {
                    var resultField = newField||SubName||Filter;
                    notify({message: 'You have successfully delete. \n Field:' + resultField, duration: 3000, position: 'right', classes: "alert-success"});
                });
            }
            else{
                if(main) updateParams.query.main = true;
                $http.post('/admin/api/filter/',updateParams).success(function (resp) {
                    var resultField = newField||SubName||Filter;
                    notify({message: 'You have successfully update. \n Field:' + resultField, duration: 3000, position: 'right', classes: "alert-success"});
                });
            }

        };
    });
