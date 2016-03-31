'use strict';
var test = require('tape'),
		Vinyl = require('vinyl'),
		gulpCleanCSS = require('../'),
		Readable = require('stream').Readable,
		Stream = require('stream'),
		PluginError = require('gulp-util/lib/PluginError');
	
var testContentsInput = 'div {    color: pink;  }';

var testFile1 = new Vinyl({
	cwd: "/home/radmen/broken-promises/",
	base: "/home/radmen/broken-promises/test",
	path: "/home/radmen/broken-promises/test/test1.css",
	contents: stringStream()
});

test('should emit error for stream files', function(t) {
	t.plan(3);

	var stream = gulpCleanCSS();

	stream
		.on('data', function() {
			t.fail('should emit error for streams');
		})
		.on('error', function(e) {
			t.pass('emitted error');
			t.ok(e instanceof PluginError, 'error is a PluginError');
			t.equal(e.plugin, 'gulp-clean-css', 'error is from gulp-clean-css');
		});

	stream.write(testFile1);
});

function stringStream() {
	var stream = new Readable();

	stream._read = function() {
		this.push('radmen');
		this.push(null);
	};

	return stream;
}
