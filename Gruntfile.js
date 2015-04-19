module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      dev: {
        options: {
          script: 'server.js'        
        }
      }
    },
    watch: {
      scripts: {
        express: {
          files: ['server.js', 'src/javascript/server/**/*.js'],
          tasks: ['express:dev'],
          options: {
            spawn: false
          }
        },
        files: ['Gruntfile.js', 'src/javascript/**/*.js', 'server.js'],
        tasks: ['build']
      }
    },
    jshint: {
      beforeconcat: ['Gruntfile.js', 'src/javascript/**/*.js', 'server.js'],
      afterconcat: ['public/javascript/application.js']
    },
    concat: {
      dist: {
        src: 'src/javascript/client/**/*.js',
        dest: 'public/javascript/application.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('build', ['jshint', 'concat']);
  grunt.registerTask('server', ['express:dev', 'watch']);
};
