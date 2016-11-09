var semver = require('semver'),
	cwd = process.cwd(),
	indent = require('detect-indent'),
	filesystem = require('./filesystem'),
	Git = require('./git-api'),
	q = require('q'),
	logger = require('tracer').colorConsole({
		format: "{{message}}"
	}),
	version;

exports.manifests = function(data){
	var filesList = ['package.json', 'bower.json'],
		files;

	if(data && typeof data === 'string'){
		files = data
			.split(',')
			.filter(function(item){
				return item.indexOf('.json') !== -1;
			});
		filesList = filesList.concat(files);
	}
	console.log(filesList);
	return filesList.filter(function(manifest){
		return filesystem.exists(cwd + '/' + manifest);
	});
};

exports.bump = function(manifest, type){
	var pkg = cwd + '/' + manifest,
		current = filesystem.readJSON(pkg),
		usedIndent;
	version = current.version = semver.inc(current.version, type);
	usedIndent = indent(filesystem.readFileSync(pkg)) || '  ';
	filesystem.writeJSON(pkg, current, usedIndent.indent);
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
			logger.info('[' + version + '] created');
			deferrer.resolve();
		})
		.catch(function(err){
			logger.error(err);
			logger.error('[' + version + '] creating failed');
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
			logger.info('[' + version + '] push');
			deferrer.resolve();
		})
		.catch(function(err){
			logger.error(err);
			logger.error('[' + version + '] push failed');
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
			logger.info(branch + ' merged to master');
			deferrer.resolve();
		})
		.catch(function(err){
			logger.error(err);
			logger.error(branch + ' merge to master failed');
			deferrer.reject(err);
		});
	return deferrer.promise;
};

exports.checkout = function(branch){
	var deferrer = q.defer();
	Git
		.checkout(branch)
		.then(function(){
			return Git.pull(branch);
		})
		.then(function(){
			deferrer.resolve();
		})
		.catch(function(err){
			logger.error(err);
			logger.error('checkout to ' + branch + ' failed');
			deferrer.reject(err);
		});
	return deferrer.promise;
};