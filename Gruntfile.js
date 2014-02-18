/*global module:false*/
module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        options: {
          globals: {
            require: true,
            module: true,
            console: true
          }
        },
        src: ['lib/**/*.js']
      },
      spec: {
        options: {
          globals: {
            require: true,
            describe: true,
            beforeEach: true,
            it: true,
            expect: true
          }
        },
        src: ['spec/**/*.js']
      }
    },

    'mochaTest': {
      src: ['spec/**/*.spec.js'],
      options: {
        reporter: 'spec'
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib']
      },
      spec: {
        files: '<%= jshint.spec.src %>',
        tasks: ['jshint:spec', 'spec']
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  
  grunt.registerTask('spec', ['mochaTest']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'spec']);
};