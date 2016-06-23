'use strict';

/* Directives */
XYZAdminCtrls.service('parseType', function () {
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
        }
    }
});