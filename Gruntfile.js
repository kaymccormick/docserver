module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	watch: {
	    gruntfile: {
		files: "Gruntfile.js",
		tasks: ["default"]
	    },
	    src: {
		files: "src/*.js",
		tasks: ["babel", "browserify"],
		options: {
		    livereload: true,
		},
	    },
	    doc: {
		files: "doc/*",
		tasks: ["sphinxBuild:xmlDoc", "sphinxBuild:htmlDoc"],
		options: {
		    livereload: true,
		},
	    }
	},
	"sphinxBuild": {
	    xmlDoc: {
		options: {
		    sourceRoot: 'doc',
		    destDir: 'doc-xml',
		    builder: 'xml'
		}
	    },
	    htmlDoc: {
		options: {
		    sourceRoot: 'doc',
		    destDir: 'doc-html',
		    builder: 'html'
		}
	    }
	},
	browserify: {
	    doc: {
		src: ['lib/doc.js'],
		dest: 'dist/docbundle.js',
		options: {
		    debug: true,
		},
	    },
	    publish: {
		src: ['lib/publish.js'],
		dest: 'dist/pubbundle.js',
		options: {
		    debug: true,
		},
	    },
	},
	babel: {
	    options: {
		sourceMap: true,
		presets: ["@babel/preset-env", "@babel/preset-react"],
		plugins: ["@babel/plugin-transform-regenerator"],
	    },
	    dist: {
		cwd: 'src',
		expand: true,
		src: ['**/*.js'],
		dest: 'lib',
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
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-sphinx-plugin');
    grunt.loadNpmTasks('grunt-browserify');

    // Default task(s).
    grunt.registerTask('default', ['babel', 'browserify', 'uglify', 'sphinxBuild:xmlDoc']);

};
