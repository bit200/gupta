'use strict';

/* Directives */
XYZAdminCtrls.filter('admin_filter', function () {
    return function(data){
        if(data && data.admin_approved == 0) {
           return data
       }
    }
});