var semver = require('semver'),
	exec = require('child-process-promise').exec,
	cwd = process.cwd(),
	fs = require('fs'),
	indent = require('detect-indent'),
	utils = require('./utils');

exports.manifests = function(){
	return ['package.json', 'bower.json'].filter(function(manifest){
		return utils.exists(cwd + '/' + manifest);
	});
};

exports.bump = function(manifest, type){
	var pkg = cwd + '/' + manifest,
		current = utils.readJSON(pkg),
		usedIndent;
	current.version = semver.inc(current.version, type);
	usedIndent = indent(utils.readFileSync(pkg)) || '  ';
	console.log(usedIndent);
	utils.writeJSON(pkg, current, usedIndent.indent);
};
