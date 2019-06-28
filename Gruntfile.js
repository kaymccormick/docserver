module.exports = function(grunt) {
    prod = false;
    if(process.env.NODE_ENV === 'production') {
	prod = true;
    }

    // Project configuration.
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
        ts: {
      default : {
        tsconfig: './tsconfig.json'
      },
        },
	watch: {
	    gruntfile: {
		files: "Gruntfile.js",
		tasks: ["default"]
	    },

	},

        
    });

    // Load the plugin that provides the "uglify" task.
//    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
//    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-ts');
//    grunt.loadNpmTasks('grunt-sphinx-plugin');
//    grunt.loadNpmTasks('grunt-browserify');

    // Default task(s).
    grunt.registerTask('default', ['ts']);

};
