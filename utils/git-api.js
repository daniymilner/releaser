var exec = require('child-process-promise').exec,
	q = require('q');

exports.commands = {
	add: 'git add .',
	commit: 'git commit -m "{{message}}"',
	addTag: 'git tag {{tag}}',
	push: 'git push',
	origin: 'origin',
	tags: '--tags',
	checkout: 'git checkout {{branch}}',
	pull: 'git pull',
	merge: 'git merge {{branch}}',
	getCommit: function(message){
		return exports.commands.commit.replace('{{message}}', message);
	},
	getTag: function(tag){
		return exports.commands.addTag.replace('{{tag}}', tag);
	},
	getPush: function(smth){
		return exports.commands.push + ' ' + exports.commands.origin + ' ' + smth;
	},
	getCheckout: function(branch){
		return exports.commands.checkout.replace('{{branch}}', branch);
	},
	getPull: function(branch){
		return exports.commands.pull + ' ' + exports.commands.origin + ' ' + branch;
	},
	getMerge: function(branch){
		return exports.commands.merge.replace('{{branch}}', branch);
	}
};

exports.messages = {
	emptyMessage: 'empty message',
	emptyTag: 'empty tag',
	emptyBranch: 'empty branch',
	emptyCommand: 'empty command'
};

exports.add = function(){
	var deferrer = q.defer(),
		command = exports.commands.add;
	exec(command)
		.then(function(){
			deferrer.resolve(command);
		})
		.fail(deferrer.reject);
	return deferrer.promise;
};

exports.commit = function(message){
	var deferrer = q.defer(), command;
	if(message){
		command = exports.commands.getCommit(message);
		exec(command)
			.then(function(){
				deferrer.resolve(command);
			})
			.fail(deferrer.reject);
	}else{
		deferrer.reject(new Error(exports.messages.emptyMessage));
	}

	return deferrer.promise;
};

exports.addTag = function(tag){
	var deferrer = q.defer(), command;
	if(tag){
		command = exports.commands.getTag(tag);
		exec(command)
			.then(function(){
				deferrer.resolve(command);
			})
			.fail(deferrer.reject);
	}else{
		deferrer.reject(new Error(exports.messages.emptyTag));
	}

	return deferrer.promise;
};

exports.push = function(branch){
	var deferrer = q.defer(),
		command = exports.commands.push;
	if(branch){
		command = exports.commands.getPush(branch);
	}
	exec(command)
		.then(function(){
			deferrer.resolve(command);
		})
		.fail(deferrer.reject);
	return deferrer.promise;
};

exports.pushTag = function(tag){
	var deferrer = q.defer(), command;
	if(tag){
		command = exports.commands.getPush(tag);
	}else{
		command = exports.commands.getPush(exports.commands.tags);
	}
	exec(command)
		.then(function(){
			deferrer.resolve(command);
		})
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
	var deferrer = q.defer(), command;
	if(branch){
		command = exports.commands.getCheckout(branch);
		exec(command)
			.then(function(){
				deferrer.resolve(command);
			})
			.fail(deferrer.reject);
	}else{
		deferrer.reject(new Error(exports.messages.emptyBranch));
	}
	return deferrer.promise;
};

exports.pull = function(branch){
	var deferrer = q.defer(), command;
	if(branch){
		command = exports.commands.getPull(branch);
		exec(command)
			.then(function(){
				deferrer.resolve(command);
			})
			.fail(deferrer.reject);
	}else{
		deferrer.reject(new Error(exports.messages.emptyBranch));
	}
	return deferrer.promise;
};

exports.merge = function(branch){
	var deferrer = q.defer(), command;
	if(branch){
		command = exports.commands.getMerge(branch);
		exec(command)
			.then(function(){
				deferrer.resolve(command);
			})
			.fail(deferrer.reject);
	}else{
		deferrer.reject(new Error(exports.messages.emptyBranch));
	}
	return deferrer.promise;
};