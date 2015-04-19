module.exports = function(grunt) {
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
      express: {
        files: ['server.js', 'src/javascript/server/**/*.js'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      },
      scripts: {
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
    },
    copy: {
      main: {
        files: [
          {
            src: ['bower_components/**/*.min.js','bower_components/**/*.min.js.map'], 
            dest: 'public/javascript/', 
            flatten: true, 
            filter: 'isFile', 
            expand: true
          }
        ]
      }
    }
  });


  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  grunt.registerTask('build', ['jshint', 'concat', 'copy']);
  grunt.registerTask('server', ['build', 'express:dev', 'watch']);
};
 
