#!/usr/bin/env node

var program = require('commander'),
	api = require('./index');

program
	.version(require('./package').version)
	.usage('[type] [options]')
	.option('--tag', '[option] - create tag with new version')
	.option('--push', '[option] - push changes to current branch');

['major', 'minor', 'patch'].forEach(function(type){
	program.option('--' + type, '[type] - increase ' + type + ' version');

	program.on(type, function(){
		setTimeout(function(){
			api.manifests().forEach(function(manifest){
				api.bump(manifest, type);
			});
			if(program.tag){
				api.tag();
			}
		}, 0);
	});
});

program.parse(process.argv);

if(program.rawArgs.length < 3){
	program.help();
}