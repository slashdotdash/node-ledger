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

    'jasmine-node': {
      run: {
        spec: 'spec'
      },
      executable: './node_modules/.bin/jasmine-node'
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
        tasks: ['jshint:spec', 'jasmine-node']
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine-node');
  
  grunt.registerTask('spec', ['jasmine-node']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'spec']);
};