'use strict';
// vim: ts=4 sw=4 noexpandtab

var through = require('through2'),
    CleanCSS  = require('clean-css'),
    uglifyError = require('./lib/error.js');

module.exports = function(opt) {
	
	if (!opt) opt = {};

	function minify(file, encoding, callback) {
		/*jshint validthis:true */

		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {
			return callback(uglifyError('Streaming not supported'));
		}

		var mangled;

		try {
			mangled = new CleanCSS(opt).minify(String(file.contents));
			file.contents = new Buffer(mangled);
			this.push(file);
		} catch (e) {
			console.warn('Error caught from clean-css: ' + e.message + ' in ' + file.path + '. Returning unminifed code');
			this.push(file);
			return callback();
		}

		callback();
	}

	return through.obj(minify);
};
