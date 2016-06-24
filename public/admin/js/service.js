'use strict';

/* Directives */
XYZAdminCtrls.service('parseType', ['parseTime', function (parseTime) {
    return {
        users: function (item) {
            var arr = [];
            _.forEach(item, function (elem) {
                var obj = {
                    elem: elem,
                    data: {
                        Name: elem.name,
                        Type: elem.role || null,
                        Introduction: elem.introduction || null,
                        Description: elem.description || null,
                        'Freelancer Type': elem.freelancer_type || null,
                        'Industry Expertise': elem.industry_expertise || null,
                        Experience: elem.experience || null,
                        'Admin Approved': elem.admin_approved,
                        'Reject Reason': elem.reject_reason || null,
                        sex: elem.sex || null,
                        isActive: elem.isActive || null
                    }
                };
                arr.push(obj)
            });
            return arr
        },
        claim: function (item) {
            var arr = [];
            _.forEach(item, function (elem) {
                var obj = {
                    elem: elem,
                    data: {
                        'Agency Name': elem.agency.name || null,
                        'Service Category': elem.agency.category || null,
                        'Currently owned by': '',
                        'Claimed by': elem.first_name + ' ' + elem.last_name,
                        Status: elem.isActive ? 'Claimed' : 'Unclaimed'
                    }
                };
                arr.push(obj)
            });
            return arr
        },
        getModel: function (Arr) {
            var arr = [];
            _.forEach(Arr, function (item) {
                arr.push(item.split(' ').shift())

            });
            return arr
        },
        job: function (item) {
            var arr = [];
            _.forEach(item, function (elem) {
                var obj = {
                    elem: elem,
                    data: {
                        title: elem.title || null,
                        type: elem.type || null,
                        description: elem.description || null,
                        'Local preference': elem.local_preference || null,
                        'Content Types': elem.content_types || null,
                        budget: elem.budget || null,
                        name: elem.name || null,
                        mobile: elem.mobile || null,
                        email: elem.email || null,
                        'Company name': elem.company_name || null,
                        website: elem.website || null,
                        'Job Visibility': elem.job_visibility || null,
                        'Date of completion': elem.date_of_completion || null,
                        admin_approved: elem.admin_approved ? (elem.admin_approved == 1 ? 'Approved' : 'Rejected') : 'Not approve'
                    }
                };
                arr.push(obj)
            });
            return arr
        },
        seller: function (item) {
            var arr = [];
            _.each(item, function (elem) {
                var obj = {
                    elem: elem,
                    data: {
                        'Display Name': elem.name || null,
                        'Service Category': elem.freelancer_type || null,
                        'Register As': elem.type || null,
                        'Posted by': (elem.user.first_name + ' ' + elem.user.last_name) || null,
                        'Created On': elem.created_at ? parseTime.date(elem.created_at) : null,
                         Status: elem.isActive ? (elem.isActive == 1 ? 'Deleted' : 'Pending Approval') : 'Listed'
                    }
                };
                arr.push(obj)
            });
            return arr
        }
    }
}]);

XYZAdminCtrls.service('parseTime', function () {
    return {
        date: function (date) {
            var today = new Date(date);
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            return (mm + '-' + dd + '-' + yyyy);
        }
    }
});

XYZAdminCtrls.service('parseRating', function () {
    return {
        rating: function (Arr) {
            _.forEach(Arr, function (item) {
                var arr = [0, 0, 0, 0, 0];
                if (item.rating > 5)
                    item.rating = 5;
                for (var i = 0; i < item.rating; i++) {
                    arr[i] = 1;
                }
                item.ratingArr = arr;
            });
            return Arr;
        },
        popularity: function (Arr) {
            _.forEach(Arr, function (item) {
                var arr = [0, 0, 0, 0];
                if (item.popularity > 4) {
                    item.popularity = 4;
                }
                for (var i = 0; i < item.popularity; i++) {
                    arr[i] = 1;
                }
                item.popularityArr = arr;
            });
            return Arr;
        }
    }
});