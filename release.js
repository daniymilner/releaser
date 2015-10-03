var program = require('commander'),
	multiline = require('multiline');

program
	.version(require('./package').version)
	.usage('[options]')
	.option('--no-tags', 'Do not create git tag')
	.option('--push', 'Push to remote repo');

program.on('--help', function(){
	console.log(multiline(function(){/*
	 Usage:

	 $ bump --patch
	 $ bump --patch --no-tags
	 $ bump --info
	 */}));
});

program.parse(process.argv);

if(program.rawArgs.length < 3){
	program.help();
}