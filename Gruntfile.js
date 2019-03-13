module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	browserify: {
	    "dist/bundle.js": 'lib/index.js',
	    options: {
		debug: true,
	    },
	},
	babel: {
	    options: {
		sourceMap: true,
		presets: ["@babel/preset-env", "@babel/preset-react"],
		plugins: ["@babel/plugin-transform-regenerator"],
	    },
	    dist: {
		files: {
		    'lib/index.js': 'src/index.js',
		    'lib/docs.js': 'src/docs.js',
		    'lib/App.js': 'src/App.js',
		},
	    },
	},
	uglify: {
	    options: {
		banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	    },
	    build: {
		src: 'dist/bundle.js',
		dest: 'dist/bundle.min.js'
	    }
	}
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-browserify');
    // Default task(s).
    grunt.registerTask('default', ['babel', 'browserify', 'uglify']);

};
