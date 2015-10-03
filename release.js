#!/usr/bin/env node

var program = require('commander'),
	api = require('./index');

program
	.version(require('./package').version)
	.usage('[type] [options]');

['major', 'minor', 'patch'].forEach(function(type){
	program.option('--' + type, 'increase ' + type + ' version');

	program.on(type, function(){
		setTimeout(function(){
			api.manifests().forEach(function(manifest){
				api.bump(manifest, type);
			});
		}, 0);
	});
});

program.parse(process.argv);

if(program.rawArgs.length < 3){
	program.help();
}