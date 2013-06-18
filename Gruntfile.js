/* global module:false */
module.exports = function(grunt) {
  var jadeFiles = [{
    expand: true,
    cwd: 'src/view/',
    src: ['*.jade'],
    dest: 'dist/',
    ext: '.html',
    rename: function (dest, path) {
      return dest + path.replace(/^(.+)\.html$/, '$1/index.html');
    }
  }];

  var lessFiles = [{
    expand: true,
    cwd: 'src/less/',
    src: ['*.less'],
    dest: 'dist/',
    ext: '.css',
    rename: function (dest, path) {
      return dest + path.replace(/^(.+)\.css$/, '$1/style.css');
    }
  }];

  var jsFiles = [
    {
      src: 'src/js/background/**/*.js',
      dest: 'dist/background.js'
    },
    {
      src: 'src/js/content/**/*.js',
      dest: 'dist/content.js'
    },
    {
      src: 'src/js/panel/**/*.js',
      dest: 'dist/panel/app.js'
    },
    {
      src: 'src/js/options/**/*.js',
      dest: 'dist/options/app.js'
    }
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pack: {
      dev: {
        src: 'dist',
        dest: '<%= pkg.version %>',
        pem: '<%= pkg.name %>'
      }
    },
    copy: {
      manifest: {
        options: {
          processContent: function(content) {
            return grunt.template.process(content);
          }
        },
        src: ['src/manifest.json'],
        dest: 'dist/manifest.json'
      },
      css: {
        expand: true,
        cwd: 'assets/vendor/',
        src: 'normalize.css',
        dest: 'dist/'
      },
      assets: {
        expand: true,
        cwd: 'assets/',
        src: [ 'fonts/*', 'icons/*', 'images/*' ],
        dest: 'dist/'
      }
    },
    jade: {
      dev: {
        options: {
          data: {
            name: '<%= pkg.name %>',
            version: '<%= pkg.version %>'
          }
        },
        files: jadeFiles
      }
    },
    less: {
      dev: {
        options: {
          yuicompress: true
        },
        files: lessFiles
      }
    },
    concat: {
      libs: {
        options: {
          banner: '/* this file is generated by uglify task of grunt.js */\n'
        },
        src: [
          'src/js/common.js',
          'assets/vendor/underscore-min.js',
          'assets/vendor/angular.min.js'
        ],
        dest: 'dist/libs.js'
      },
      dev: {
        options: {
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' + src;
          }
        },
        files: jsFiles
      }
    },
    regarde: {
      view: {
        files: ['src/view/**/*.jade', 'src/view/**/*.markdown'],
        tasks: ['jade:dev']
      },
      less: {
        files: 'src/less/**/*.less',
        tasks: ['less:dev']
      },
      libs: {
        files: 'src/js/*.js',
        tasks: ['concat:libs']
      },
      dev: {
        files: 'src/js/**/*.js',
        tasks: ['concat:dev']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-regarde');

  grunt.registerMultiTask('pack', 'Creating a package', function () {
    var done = this.async();
    var dir = this.files[0].src[0];

    if (!grunt.file.isDir(dir)) {
      return;
    }

    var options = {
      cmd: 'packaging',
      args: [
        dir,
        this.files[0].dest,
        this.data.pem
      ]
    };

    grunt.util.spawn(options, done);
  });

  grunt.registerTask('build', ['copy', 'jade', 'less', 'concat']);

  grunt.registerTask('default', ['build', 'regarde']);
};
