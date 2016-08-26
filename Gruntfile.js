// Generated on 2014-04-03 using generator-angular 0.7.1
'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-strip');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-apidoc');
    grunt.loadNpmTasks('grunt-ng-annotate');

    //try {
    //    var _data = JSON.stringify(require('./doc/api_data.json'));
    //} catch(e) {}
    //
    //var cd = new Date()
    //var v_original = require('./versions.json')
    //v_original = incrv(v_original)
    ////todo fix string replace. It triggered earlier than file creator
    //function incrv(v) {
    //    var d = v.common_v.split('.')
    //    d[2] = parseInt(d[2]) + 1
    //    v.common_v = d.join('.')
    //    return v
    //}
    //
    //function incrLibv(v) {
    //    console.log('in incrLibv v.v_lib = ', v);
    //    var d = v.lib_v.split('.');
    //    d[2] = parseInt(d[2]) + 1;
    //    v.lib_v = d.join('.');
    //    return v
    //}
    //
    //function _get(v) {
    //    return JSON.parse(JSON.stringify(v))
    //}
    //
    //function pb (value) {
    //    return value < 10 ? '0' + value : value
    //}
    //cd = [pb(cd.getDate()), pb(cd.getMonth() + 1), cd.getFullYear()].join('-')
    //
    //var _dist = 'app'
    //
    //var v = _get(v_original)
    //var new_templates_url = 'views_dist/' + v.common_v
    //
    //v.css_v = v.common_v;
    //v.script_v = v.common_v;
    //v.template_v = v.common_v;

    grunt.initConfig({
        yeoman: {
            //css_v: v.css_v,
            //script_v: v.script_v,
            //lib_v: v.lib_v,
            //template_v: v.template_v,
            //new_template_url: new_templates_url,
            //lib_prefix: v.lib_prefix,
            //css_prefix: v.css_prefix,
            //css_name: _dist + '/dist/css/' + v.css_prefix + '.min.css',
            //script_name: _dist + '/dist/script/' + v.script_prefix + '.min.js',
            //lib_name: _dist + '/dist/lib/' + v.lib_prefix + '.min.js',
            //cd: cd,
            //app: require('./bower.json').appPath || 'src',
            dist: 'public',
            v1: 'app/v1',
            lib_arr: [
                '<%= yeoman.app %>/bower_components/jquery/dist/jquery.min.js'
            ],
            scripts_arr: [
                '<%= yeoman.dist %>/scripts/app.js'
                , '<%= yeoman.dist %>/scripts/*/*.js'
                , '<%= yeoman.dist %>/scripts/*/*/*.js'
            ]

        },
        apidoc: {
            myapp: {
                src: "app/",
                dest: "doc/"
            }
        },
        watch: {
            apidoc: {
                files: ['app/{,*/}*.js', 'app/**/{,*/}*.js'],
                tasks: ['prod'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['public/src.html'],
                tasks: ['prod'],
                options: {
                    spawn: false
                }
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['serve'],
                options: {
                    spawn: false
                }
            }
        },

        jssemicoloned: {
            files: ['<%= yeoman.app %>/scripts/{,**/}*.js']
            //            files: ['<%= yeoman.app %>/scripts/controllers/*.js']
        },
        strip: {
            dist: {
                src: '<%= yeoman.dist %>/dist/src/script.js',
                dest: '<%= yeoman.dist %>/dist/src/script.built.js',
                options: {
                    nodes: ['console.log', 'console.warn', 'console.error', 'alert'],
                    inline: true
                }
            },
            v1: {
                src: '<%= yeoman.v1 %>/dist/src/script.js',
                dest: '<%= yeoman.v1 %>/dist/src/script.built.js',
                options: {
                    nodes: ['console.log', 'console.warn', 'console.error', 'alert'],
                    inline: true
                }
            }
        },
        comments: {
            dist: {
                options: {
                    singleline: true,
                },
                src: ['<%= yeoman.dist %>/dist/src/script.built.js']
            },
            v1: {
                options: {
                    singleline: true,
                    multiline: true
                },
                src: ['<%= yeoman.v1 %>/dist/src/script.built.js']
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            production: {
                files: [{
                    "public/dist/dist.min.js": [
                        "public/bower_components/jquery/dist/jquery.js",
                        "public/js/libs/flexMenu.js",
                        "public/bower_components/underscore/underscore-min.js",
                        "public/bower_components/bootstrap/dist/js/bootstrap.min.js",
                        "public/bower_components/angular/angular.js",
                        "public/js/libs/angular-materials-icons.min.js",
                        "public/bower_components/ng-dialog/js/ngDialog.min.js",
                        "public/bower_components/angular-aria/angular-aria.js",
                        "public/bower_components/angular-material/angular-material.js",
                        "public/bower_components/ng-img-crop/compile/minified/ng-img-crop.js",
                        "public/bower_components/ng-file-upload/ng-file-upload-shim.min.js",
                        "public/bower_components/ng-file-upload/ng-file-upload.min.js",
                        "public/bower_components/angular-animate/angular-animate.js",
                        "public/bower_components/angular-ui-router/release/angular-ui-router.js",
                        "public/bower_components/angular-resource/angular-resource.js",
                        "public/bower_components/angularjs-slider/dist/rzslider.min.js",
                        "public/bower_components/angular-ui-select/dist/select.js",
                        "public/bower_components/angular-notify/angular-notify.js",
                        "public/bower_components/angular-modal-service/dst/angular-modal-service.min.js",
                        "public/bower_components/angular-bootstrap/ui-bootstrap.js",
                        "public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
                        "public/bower_components/angular-socket-io/socket.min.js",
                        "public/bower_components/angular-facebook/lib/angular-facebook.js",
                        "public/bower_components/angular-directive.g-signin/google-plus-signin.js",
                        "public/bower_components/angular-loading-bar/build/loading-bar.js",
                        "public/bower_components/tableexport.js/dist/js/tableexport.js",
                        "public/bower_components/file-saver.js/FileSaver.js",
                        "https://apis.google.com/js/api:client.js",
                        "public/js/libs/angular-breadcrumb.js",
                        "public/js/libs/socket.io.js",
                        "public/js/app.js",
                        "public/js/directives.js",
                        "public/js/directives/jobs-list/jobs-list.drct.js",
                        "public/js/directives/selector/selector.drct.js",
                        "public/js/directives/budget/budget.drct.js",
                        "public/js/directives/mess/mess.drct.js",
                        "public/js/directives/error/error.drct.js",
                        "public/js/directives/succ/succ.drct.js",
                        "public/js/directives/desc/desc.drct.js",
                        "public/js/directives/open/open.drct.js",
                        "public/js/directives/contract-post/contract-post.drct.js",
                        "public/js/directives/contract-detailed/contract-detailed.drct.js",
                        "public/js/directives/apply-detailed/apply-detailed.drct.js",
                        "public/js/directives/apply-post/apply-post.drct.js",
                        "public/js/directives/job-detailed/job-detailed.drct.js",
                        "public/js/directives/job-post/job-post.drct.js",
                        "public/js/directives/btns/btns.drct.js",
                        "public/js/directives/edit/edit.drct.js",
                        "public/js/directives/permission/permission.drct.js",
                        "public/js/directives/freelancer/freelancer.drct.js",
                        "public/js/directives/short-preview/short-preview.drct.js",
                        "public/js/directives/buyer/buyer.drct.js",
                        "public/js/directives/is-edited/is-edited.drct.js",
                        "public/js/directives/date/date.drct.js",
                        "public/js/directives/acts/acts.drct.js",
                        "public/js/directives/category-job/category.drct.js",
                        "public/js/directives/category-list/category-list.drct.js  ",
                        "public/js/services.js",
                        "public/js/filter.js",
                        "public/js/run.js",
                        "public/js/config.js",
                        "public/js/controllers/main.ctrl.js",
                        "public/js/controllers/claim_agencies.ctrl.js",
                        "public/js/controllers/common.ctrl.js",
                        "public/js/controllers/view_projects.ctrl.js",
                        "public/js/controllers/category.ctrl.js",
                        "public/js/controllers/confirm.ctrl.js",
                        "public/js/controllers/contract.ctrl.js",
                        "public/js/controllers/contractApprove.ctrl.js",
                        "public/js/controllers/apply.ctrl.js",
                        "public/js/controllers/contractClose.ctrl.js",
                        "public/js/controllers/forgot.ctrl.js",
                        "public/js/controllers/freelancer_registration.ctrl.js",
                        "public/js/controllers/header.ctrl.js",
                        "public/js/controllers/home.ctrl.js",
                        "public/js/controllers/dashboard.ctrl.js",
                        "public/js/controllers/job.ctrl.js",
                        "public/js/controllers/postjob.ctrl.js",
                        "public/js/controllers/buyer_profile.ctrl.js",
                        "public/js/controllers/uploadFile.ctrl.js",
                        "public/js/controllers/user.ctrl.js",
                        "public/js/controllers/viewMyJob.ctrl.js",
                        "public/js/controllers/chat.ctrl.js",
                        "public/js/controllers/login.ctrl.js",
                        "public/js/controllers/signup.ctrl.js",
                        "public/js/controllers/myProfile.ctrl.js",
                        "public/js/controllers/favorite.ctrl.js",
                        "public/js/libs/carousel.js"
                    ]
                }]
            }

        },
        cssmin: {
            combine: {
                files: [
                    {
                        "public/dist/dist.min.css":[
                            "public/bower_components/bootstrap/dist/css/bootstrap.css",
                            "public/bower_components/angular-ui-select/dist/select.css",
                            "public/bower_components/angularjs-slider/dist/rzslider.min.css",
                            "public/css/app.css",
                            "public/css/auth.css",
                            "public/css/home.css",
                            "public/css/directive.css",
                            "public/css/jobs.css",
                            "public/css/claim-angency.css",
                            "public/css/how_it_work.css",
                            "public/css/font-awesome.min.css",
                            "public/css/flex-menu.css",
                            "public/css/chat.css",
                            "public/css/img.css",
                            "public/css/samples.css",
                            "public/fonts/font.css",
                            "public/css/angular-material-menu.css",
                            "public/css/seller-details.css",
                            "public/bower_components/angular-material/angular-material.css",
                            "public/bower_components/ng-dialog/css/ngDialog.css",
                            "public/bower_components/ng-dialog/css/ngDialog-theme-default.css",
                            "public/bower_components/angular-notify/angular-notify.css",
                            "public/bower_components/angular-bootstrap/ui-bootstrap-csp.css",
                            "public/bower_components/ng-img-crop/compile/minified/ng-img-crop.css",
                            "public/bower_components/angular-loading-bar/build/loading-bar.css",
                            "public/bower_components/tableexport.js/dist/css/tableexport.css",
                            'public/js/libs/carousel.css'
                        ]
                    }
                ]
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'public/',
                    src: '*/**.js',
                    dest: 'public/'
                }]
            }
        },

        'string-replace': {
            apihtml: {
                files: {
                    'public/index.html': 'public/index.html'
                },
                options: {
                    replacements: [{
                        pattern: 'on_replace_data',
                        replacement: JSON.stringify(require('./doc/api_data.json'))
                    }]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    //collapseWhitespace: true,
                    //collapseBooleanAttributes: true,
                    //removeCommentsFromCDATA: true,
                    //removeOptionalTags: true
                },
                files: {
                    'public/index.html': 'public/src.html'
                }
            }

        }
    });
    grunt.registerTask('prod', [
        'apidoc',
        'htmlmin',
        'string-replace:apihtml'
    ]);
    grunt.registerTask('serve', function (target) {

        grunt.task.run([
            'prod',
            'watch'
        ]);
    });
};
