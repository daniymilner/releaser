var semver = require('semver'),
	exec = require('child-process-promise').exec,
	cwd = process.cwd(),
	git = require('simple-git')(cwd),
	fs = require('fs'),
	indent = require('detect-indent'),
	utils = require('./utils'),
	version;

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
	return git
		.add(exports.manifests())
		.commit('release ' + version)
		.addTag(version)
		.then(function(){
			console.log('[' + version + '] created');
		})
};

exports.push = function(){
	return exec('git push')
		.then(function(){
			return git.pushTags('origin')
		})
		.then(function(){
			console.log('[' + version + '] pushed');
		});
};

exports.merge = function(branch){
	return git.checkout('master')
		.pull('origin', 'master')
		.then(function(){
			return exec('git merge ' + branch)
				.then(function(){
					return git.push('origin', 'master');
				})
		});
};