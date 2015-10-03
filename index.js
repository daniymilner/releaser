var semver = require('semver'),
	exec = require('child-process-promise').exec,
	cwd = process.cwd(),
	fs = require('fs'),
	indent = require('detect-indent');

exports.manifests = function(){
	return ['package.json', 'bower.json'].filter(function(manifest){
		return fs.existsSync(cwd + '/' + manifest);
	});
};

exports.bump = function(manifest, type){
	var pkg = cwd + '/' + manifest,
		current = require(pkg),
		usedIndent, version;
	current.version = semver.inc(current.version, type);
	version = current.version;
	usedIndent = indent(fs.readFileSync(pkg, 'utf8')) || '  ';
	fs.writeFileSync(pkg, JSON.stringify(current, null, usedIndent));
};
