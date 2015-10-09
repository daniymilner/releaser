#!/usr/bin/env node

var program = require('commander'),
	minimist = require('minimist')(process.argv.slice(2)),
	api = require('./index'),
	lock = false,
	branch;

program
	.version(require('./package').version)
	.usage('[type] [branch] [options]')
	.option('--branch [name]', '[branch] - set local branch name')
	.option('--tag', '[option] - create tag with new version')
	.option('--push', '[option] - push changes to current branch')
	.option('--master', '[option] - merge changes to master');

['major', 'minor', 'patch'].forEach(function(type){
	program.option('--' + type, '[type] - increase ' + type + ' version');

	program.on(type, function(){
		if(!lock){
			lock = true;

			setTimeout(function(){
				api.manifests().forEach(function(manifest){
					api.bump(manifest, type);
				});
				if(program.tag){
					api.tag()
						.then(function(){
							if(program.branch && typeof minimist['branch'] === 'string' && minimist['branch'] && program.push){
								branch = minimist['branch'];
								api.push(branch)
									.then(function(){
										api.merge(branch);
									})
							}
						})
				}
			}, 0);
		}
	});
});

program.parse(process.argv);

if(program.rawArgs.length < 3){
	program.help();
}