'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'public/'
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            dev: {
                files: ['public/**/*'],
                tasks: []
            }
        }
    });

    grunt.registerTask('dev', ['connect', 'watch']);

}
