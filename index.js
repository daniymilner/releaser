var semver = require('semver'),
	exec = require('child-process-promise').exec,
	cwd = process.cwd(),
	fs = require('fs'),
	indent = require('detect-indent'),
	utils = require('./utils'),
	version;

function logError(err){
	console.log(err);
}

exports.manifests = function(){
	return ['package.json', 'bower.json'].filter(function(manifest){
		return utils.exists(cwd + '/' + manifest);
	});
};

exports.bump = function(manifest, type){
	var pkg = cwd + '/' + manifest,
		current = utils.readJSON(pkg),
		usedIndent;
	version = current.version = semver.inc(current.version, type);
	usedIndent = indent(utils.readFileSync(pkg)) || '  ';
	utils.writeJSON(pkg, current, usedIndent.indent);
};

exports.tag = function(){
	exec('git add .')
		.then(function(){
			return exec('git commit -m "release ' + version + ' "');
		}, logError)
		.then(function(){
			return exec('git tag ' + version);
		}, logError)
};
