#!/usr/bin/env node

var program = require('commander'),
	minimist = require('minimist')(process.argv.slice(2)),
	api = require('./index'),
	lock = false,
	branch;

program
	.version(require('./package').version)
	.usage('[type] [options]')
	.option('--tag', '[option] - create tag with new version')
	.option('--push', '[option] - push changes to current branch')
	.option('--master [branch]', '[option] - merge changes to master');

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
							if(program.push){
								api.push()
									.then(function(){
										if(program.master && typeof minimist['master'] === 'string' && minimist['master']){
											branch = minimist['master'];
											api.merge(branch);
										}
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