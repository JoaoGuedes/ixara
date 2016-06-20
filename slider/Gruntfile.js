'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-babel');

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'public/scripts/slider.js': 'src/slider.js'
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'public/'
                }
            }
        },
        watch: {
            static: {
                files: ['public/**/*'],
                tasks: [],
                options: {
                    livereload: true
                }
            },
            babel: {
                files: ['src/**/*.js'],
                tasks: ['babel']
            }
        }
    });

    grunt.registerTask('dev', ['connect', 'watch']);

}
