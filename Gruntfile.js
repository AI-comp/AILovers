module.exports = function(grunt) {

    // Load tasks
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.initConfig({

        less: {
            development: {
                options: {
                    paths: ["assets/css"]
                },
                files: {
                    "client/css/app.css": "client/css/app.less"
                }
            }
        },

        watch: {
            styles: {
                // Which files to watch (all .less files recursively in the less directory)
                files: ['client/css/**/*.less'],
                    tasks: ['less'],
                    options: {
                        nospawn: true
                    }
            }
        },

        concurrent: {
            dev: ['nodemon:dev', 'watch']
        },

        nodemon: {
            dev: {
                script: './server/main.js'
            }
        },

        clean: ["node_modules", "client/components"]

    });

    grunt.registerTask('dev', ['less', 'concurrent:dev']);

};