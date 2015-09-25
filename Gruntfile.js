
'use strict';
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            dev: {
                options: {
                    compress: true
                },
                files: {
                    'www/css/index.css': 'www/css/index.less'
                }
            }
        },
        watch: {
            devLess: {
                files: ['www/css/*.less'],
                tasks: ['less:dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('nodeserver', 'Start NodeJs server. "node app.js"', function () {

        var ref = grunt.util.spawn({
            cmd: 'node',
            args: ['app.js']
        }, function (err, res, code) {
            grunt.log.writeln('NodeJs server exited with code: ' + code);
        });

        grunt.log.writeln('NodeJs server started (PID:' + ref.pid + ')...');

        ref.stdout.on('data', function(data) {
            grunt.log.writeln(data);
        });
        ref.stderr.on('data', function(data) {
            grunt.log.writeln(data);
        });
    });

    grunt.registerTask('devel', [
        'less:dev',
    ]);

    grunt.registerTask('default', ['devel', 'nodeserver', 'watch']);
};
