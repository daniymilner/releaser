var semver = require('semver'),
	cwd = process.cwd(),
	Git = require('./api'),
	indent = require('detect-indent'),
	utils = require('./utils'),
	q = require('q'),
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
	var deferrer = q.defer();
	Git.add()
		.then(function(){
			return Git.commit('release ' + version);
		})
		.then(function(){
			return Git.addTag(version);
		})
		.then(function(){
			console.log('[' + version + '] created');
			deferrer.resolve();
		})
		.catch(function(err){
			console.log(err);
			console.log('[' + version + '] creating failed');
			deferrer.reject(err);
		});
	return deferrer.promise;
};

exports.push = function(branch){
	var deferrer = q.defer();
	Git.push(branch)
		.then(function(){
			return Git.pushTag(version);
		})
		.then(function(){
			console.log('[' + version + '] push');
			deferrer.resolve();
		})
		.catch(function(err){
			console.log(err);
			console.log('[' + version + '] push failed');
			deferrer.reject(err);
		});
	return deferrer.promise;
};

exports.merge = function(branch){
	var deferrer = q.defer();
	Git
		.checkout('master')
		.then(function(){
			return Git.pull('master');
		})
		.then(function(){
			return Git.merge(branch)
		})
		.then(function(){
			return Git.push();
		})
		.then(function(){
			return Git.checkout(branch);
		})
		.then(function(){
			console.log(branch + ' merged to master');
			deferrer.resolve();
		})
		.catch(function(err){
			console.log(err);
			console.log(branch + ' merge to master failed');
			deferrer.reject(err);
		});
	return deferrer.promise;
};