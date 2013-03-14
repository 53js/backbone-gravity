'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	// configurable paths
	var conf = {
		dist: 'build'
	};

	grunt.initConfig({
		conf: conf,
		clean: {
			dist: ['.tmp', '<%= conf.dist %>/*'],
			server: '.tmp'
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'helpers/{,*/}*.js',
				'test/spec/{,*/}*.js'
			]
		},
		uglify: {
			dist: {
				files: {
					'<%= conf.dist %>/backbone-gravity-helper.js': [
						'helpers/{,*/}*.js'
					],
					'<%= conf.dist %>/box2dweb.js': [
						'lib/Box2dWeb-2.1.a.3.min.js'
					]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', [
		'clean',
		'jshint',
		'uglify'
	]);
};
