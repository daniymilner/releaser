var exec = require('child-process-promise').exec,
	q = require('q');

exports.add = function(){
	var deferrer = q.defer();
	exec('git add .')
		.then(deferrer.resolve)
		.fail(deferrer.reject);
	return deferrer.promise;
};

exports.commit = function(message){
	var deferrer = q.defer();
	exec('git commit -m "' + message + '"')
		.then(deferrer.resolve)
		.fail(deferrer.reject);
	return deferrer.promise;
};

exports.addTag = function(tag){
	var deferrer = q.defer();
	exec('git tag ' + tag)
		.then(deferrer.resolve)
		.fail(deferrer.reject);
	return deferrer.promise;
};

exports.push = function(branch){
	var deferrer = q.defer(),
		command = 'git push';
	if(branch){
		command += ' origin ' + branch;
	}
	exec(command)
		.then(deferrer.resolve)
		.fail(deferrer.reject);
	return deferrer.promise;
};

exports.pushTag = function(tag){
	var deferrer = q.defer(),
		command = 'git push origin ';
	if(tag){
		command += tag;
	}else{
		command += '--tags'
	}
	exec(command)
		.then(deferrer.resolve)
		.fail(deferrer.reject);
	return deferrer.promise;
};

exports.pushAll = function(){
	var deferrer = q.defer();
	exports
		.push()
		.then(function(){
			return exports.pushTag();
		})
		.then(deferrer.resolve)
		.catch(deferrer.reject);
	return deferrer.promise;
};

exports.checkout = function(branch){
	var deferrer = q.defer();
	exec('git checkout ' + branch)
		.then(deferrer.resolve)
		.fail(deferrer.reject);
	return deferrer.promise;
};

exports.pull = function(branch){
	var deferrer = q.defer();
	exec('git pull origin ' + branch)
		.then(deferrer.resolve)
		.fail(deferrer.reject);
	return deferrer.promise;
};

exports.merge = function(branch){
	var deferrer = q.defer();
	exec('git merge ' + branch)
		.then(deferrer.resolve)
		.fail(deferrer.reject);
	return deferrer.promise;
};