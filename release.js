#!/usr/bin/env node

var program = require('commander'),
	minimist = require('minimist')(process.argv.slice(2)),
	api = require('./utils/api'),
	lock = false,
	logger = require('tracer').colorConsole({
		format: "{{message}}"
	}),
	branch, files;

program
	.version(require('./package').version)
	.usage('[type] [branch] [options]')
	.option('--branch [name]', '[branch] - set local branch name')
	.option('--tag', '[option] - create tag with new version')
	.option('--push', '[option] - push changes to current branch')
	.option('--master', '[option] - merge changes to master')
	.option('--full', '[option] - --tag --push --master')
	.option('--files', '[option] - files in which must be saved version');

['major', 'minor', 'patch'].forEach(function(type){
	program.option('--' + type, '[type] - increase ' + type + ' version');

	program.on(type, function(){
		if(!lock){
			lock = true;

			setTimeout(function(){
				files = program.files ? minimist['files'] : '';

				api.manifests(files).forEach(function(manifest){
					api.bump(manifest, type);
				});
				if(program.branch && typeof minimist['branch'] === 'string' && minimist['branch']){
					branch = minimist['branch'];
					api.checkout(branch).then(function(){
						if(program.full){
							api.tag()
								.then(function(){
									return api.push(branch);
								})
								.then(function(){
									api.merge(branch);
								})
						}else if(program.tag){
							api.tag().then(function(){
								if(program.push){
									api.push(branch).then(function(){
										if(program.master){
											api.merge(branch);
										}
									})
								}
							})
						}
					});
				}else{
					logger.error('expected parameter --branch [name]')
				}
			}, 0);
		}
	});
});

program.parse(process.argv);

if(program.rawArgs.length < 3){
	program.help();
}