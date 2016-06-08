'use strict';

/* Directives */
XYZAdminCtrls.service('parseType', function () {
    return {
        users: function (item) {
            var arr = [];
            _.forEach(item, function (elem) {
                var obj = {
                    username: elem.username,
                    role: elem.role || null,
                    type: elem.type || null,
                    first_name: elem.first_name || null,
                    last_name: elem.last_name || null,
                    email: elem.email || null,
                    confirm_code: elem.confirm_code || null,
                    admin_approved: elem.admin_approved,
                    reject_reason: elem.reject_reason || null,
                    sex: elem.sex || null,
                    isActive: elem.isActive || null
                };
                arr.push(obj)
            });
            return arr
        },
        claim: function (item) {
            var arr = [];
            _.forEach(item, function (elem) {
                var obj = {
                    'Agency Name': elem.name || null,
                    'Service Category': elem.category || null,
                    'Currently owned by': elem.first_name + ' ' + elem.last_name,
                    'Claimed by': elem.user || null,
                     Status: elem.isAvtive || false
                };
                arr.push(obj)

            });
            return arr
        }
    }
});