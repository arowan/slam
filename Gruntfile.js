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
        tasks: ['sync']
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
    sync: {
      main: {
        files: [
          {
            cwd: 'bower_components',
            src: [
              '**/*.min.js',
              '**/*.min.js.map',
              'angular-route-segment/build/angular-route-segment.js',
              'ngDraggable/ngDraggable.js'
            ],
            dest: 'public/javascript',
            flatten: true, 
            filter: 'isFile', 
            expand: true
          },{
            cwd: 'src/javascript/client/templates',
            src: [
              '**/*.html'
            ],
            dest: 'public/templates'
          }
        ],
        verbose: true
      }
    }
  });


  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-sync');

  grunt.registerTask('build', ['jshint', 'concat', 'sync', 'sass']);
  grunt.registerTask('server', ['build', 'express:dev', 'watch']);
};
 
