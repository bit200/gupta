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
        cssmin:  {
            options: {
                keepSpecialComments: 0
            },
            target: {
                expand: true,
                files: [
                    {
                        '<%= yeoman.app %>/styles/done.min.css': [
                            '<%= yeoman.app %>/styles/bootstrap.css'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/tempcss',
                        src: ['{,**/}*.css', '!{,**/}*.min.css'],
                        dest: '<%= yeoman.dist %>/tempcss',
                        ext: '.min.css'
                    }]
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
            dist: {
                files: {
                    '<%= yeoman.script_name %>': ['<%= yeoman.dist %>/dist/src/script.built.js'],
                }
            },
            lib: {
                files: {
                    '<%= yeoman.lib_name %>': ['<%= yeoman.dist %>/dist/src/libs.js']
                }
            },
            v1: {
                files: {
                    '<%= yeoman.v1 %>/dist/script.min.js': ['<%= yeoman.v1 %>/dist/src/script.built.js'],
                    '<%= yeoman.v1 %>/dist/libs.min.js': ['<%= yeoman.v1 %>/dist/src/libs.js']
                }
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
