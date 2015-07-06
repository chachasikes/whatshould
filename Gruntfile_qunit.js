module.exports = function(grunt) {
  'use strict';
  
  // Project configuration.
  grunt.initConfig({
    qunit: {
        all: ['test/qunit-runner.html']
    },
  });

  grunt.registerTask('test', 'qunit');
  grunt.loadNpmTasks('grunt-contrib-qunit');
};