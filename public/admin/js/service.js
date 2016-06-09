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
                var obj = { elem: elem,
                    data: {
                        'Agency Name': elem.agency.name || null,
                        'Service Category': elem.agency.category || null,
                        'Currently owned by': '',
                        'Claimed by': elem.first_name + ' ' + elem.last_name,
                        Status: elem.isAvtive ? 'Claimed' : 'Unclaimed'
                    }
                };
                arr.push(obj)

            });
            return arr
        }
    }
});