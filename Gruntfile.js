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
        files: ['server.js', 'src/javascript/server/**/*.js', 'bower_components/**/'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      },
      scripts: {
        files: ['Gruntfile.js', 'src/javascript/**/*.js', 'server.js'],
        tasks: ['build']
      },
      templates: {
        files: ['src/javascript/client/templates/**/*.html'],
        tasks: ['copy']
      },
      stylesheets: {
        files: ['src/stylesheets/**/*.scss'],
        tasks: ['sass']
      }
    },
    jshint: {
      beforeconcat: ['Gruntfile.js', 'src/javascript/**/*.js', 'server.js'],
      afterconcat: ['public/javascript/application.js'],
      options: {
        debug: true
      }
    },
    concat: {
      dist: {
        src: 'src/javascript/client/**/*.js',
        dest: 'public/javascript/application.js'
      }
    },
    sass: {
      dist: {
        files: {
          'public/stylesheets/client.css': 'src/stylesheets/client.scss'
        }
      }
    },
    copy: {
      main: {
        files: [
          {
            src: [
            'bower_components/**/*.min.js',
            'bower_components/**/*.min.js.map',
            'bower_components/angular-route-segment/build/angular-route-segment.js'
            ], 
            dest: 'public/javascript/', 
            flatten: true, 
            filter: 'isFile', 
            expand: true
          },
          {
            src: 'src/javascript/client/templates/**/*.html', 
            dest: 'public/templates/',
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
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('build', ['jshint', 'concat', 'copy', 'sass']);
  grunt.registerTask('server', ['build', 'express:dev', 'watch']);
};
 
