module.exports = function(grunt) {
	var jsVendorFiles = [
		'expressapp/public/bower_components/jquery/dist/jquery.min.js',
		'expressapp/public/bower_components/bootstrap/dist/js/bootstrap.min.js',
		'expressapp/public/bower_components/bootstrap-switch/dist/js/bootstrap-switch.min.js',
		'expressapp/public/bower_components/angular/angular.min.js',
		'expressapp/public/bower_components/angular-sanitize/angular-sanitize.min.js',
		'expressapp/public/bower_components/angular-ui-router/release/angular-ui-router.min.js',
		'expressapp/public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
		// 'expressapp/public/bower_components/angular-xeditable/dist/js/xeditable.min.js'
		// 'expressapp/public/bower_components/angular-busy/dist/angular-busy.min.js'
		'expressapp/public/bower_components/angular-scroll/angular-scroll.min.js',
		'expressapp/public/bower_components/oclazyload/dist/ocLazyLoad.min.js',
		'expressapp/public/bower_components/lodash/dist/lodash.min.js',
		'expressapp/public/bower_components/moment/min/moment.min.js',
		'expressapp/public/bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch.min.js'
	];
	var vendorminjs = 'expressapp/public/vendors.min.js';

	var angularInit = [
		'expressapp/public/angular-app/init.app.js',
		'expressapp/public/angular-app/main-config.app.js',
		'expressapp/public/angular-app/router-config.app.js',
		'expressapp/public/angular-app/run.app.js',
	];
	var angularInitMin = 'expressapp/public/angular-app/app.min.js';

	var cssFiles = [
		'expressapp/public/bower_components/bootstrap/dist/css/bootstrap.min.css',
		'expressapp/public/bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
		'expressapp/public/bower_components/bootstrap-social/bootstrap-social.css',
		'expressapp/public/bower_components/font-awesome/css/font-awesome.min.css',
		'expressapp/public/static-assets/fonts/Kaushan-Script/css/fonts.css',
		'expressapp/public/static-assets/css/agency.css',
		'expressapp/public/stylesheets/app.css'
	];

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: '\n',
			},
			jsVendorFiles: {
				src : jsVendorFiles,
				dest : vendorminjs
			},
			cssFilse: {
				src : cssFiles,
				dest : 'expressapp/public/stylesheets/app.min.css'
			}
		},
		uglify : {
			options: {
				mangle: false
			},
			angularInitMin : {
				src : angularInit,
				dest : angularInitMin
			},
			angularAppMin: {
				files: grunt.file.expandMapping(['expressapp/public/angular-app/**/*.js'], '', {
					rename: function(destBase, destPath) {
						var arr = destPath.split('angular-app');
						var newPath = arr[0] + 'angular-app-build' + arr[1];
						return newPath.replace('.js', '.min.js');
					}
				})
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', [
		'concat',
		'uglify',
	]);
}