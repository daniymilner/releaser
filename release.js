#!/usr/bin/env node

var program = require('commander'),
	api = require('./index'),
	lock = false;

function lockOff(){
	lock = false;
}

program
	.version(require('./package').version)
	.usage('[type] [options]')
	.option('--tag', '[option] - create tag with new version')
	.option('--push', '[option] - push changes to current branch');

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
									.then(lockOff)
							}else{
								lockOff();
							}
						})
				}else{
					lockOff();
				}
				//api.checkout('test');
			}, 0);
		}
	});
});

program.parse(process.argv);

if(program.rawArgs.length < 3){
	program.help();
}