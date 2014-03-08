module.exports = function(grunt) {

    // Load tasks
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.initConfig({

        nodemon: {
            dev: {
                script: './server/server.js'
            }
        },

        clean: ["node_modules", "client/components"]

    });

    grunt.registerTask('dev', ['nodemon']);

};