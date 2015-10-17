var rewire = require("rewire"),
	expect = require('chai').expect,
	q = require('q'),
	filesystem = require('../utils/filesystem');

describe('API', function(){
	var api = rewire('../utils/api.js');

	beforeEach(function(){
		api.__set__('logger.error', function(){});
		api.__set__('logger.info', function(){});
	});

	it('manifests', function(){
		api.__set__('filesystem.exists', function(){
			return true;
		});
		var data = api.manifests();
		expect(data).to.have.length(2);
	});

	describe('Bump', function(){
		var jsonPath = './test/test.json', version = '0.0.2';
		before(function(){
			filesystem.writeJSON(jsonPath, {version: '0.0.1'});
			api.__set__('semver.inc', function(){
				return version;
			});
		});
		it('bump with indent', function(){
			api.__set__('indent', function(){
				return {indent: '\t'}
			});
			api.bump('test/test.json');
			var json = filesystem.readJSON(jsonPath);
			expect(json.version).to.be.equal(version);
		});
		it('bump without indent', function(){
			api.__set__('indent', function(){});
			api.bump('test/test.json');
			var json = filesystem.readJSON('./test/test.json');
			expect(json.version).to.be.equal(version);
		});
	});

	describe('Tag function', function(){
		beforeEach(function(){
			api.__set__('Git.add', function(){
				var deferrer = q.defer();
				deferrer.resolve();
				return deferrer.promise;
			});
			api.__set__('Git.commit', function(){
				var deferrer = q.defer();
				deferrer.resolve();
				return deferrer.promise;
			});
			api.__set__('version', '0.0.0');
		});
		it('check success promise', function(done){
			api.__set__('Git.addTag', function(){
				var deferrer = q.defer();
				deferrer.resolve();
				return deferrer.promise;
			});
			api
				.tag()
				.then(function(){
					done();
				})
		});
		it('check error promise', function(done){
			api.__set__('Git.addTag', function(){
				var deferrer = q.defer();
				deferrer.reject(new Error());
				return deferrer.promise;
			});
			api
				.tag()
				.catch(function(){
					done();
				})
		});
	});

	describe('Push function', function(){
		beforeEach(function(){
			api.__set__('Git.push', function(){
				var deferrer = q.defer();
				deferrer.resolve();
				return deferrer.promise;
			});
			api.__set__('version', '0.0.0');
		});
		it('check success promise', function(done){
			api.__set__('Git.pushTag', function(){
				var deferrer = q.defer();
				deferrer.resolve();
				return deferrer.promise;
			});
			api
				.push()
				.then(function(){
					done();
				})
		});
		it('check error promise', function(done){
			api.__set__('Git.pushTag', function(){
				var deferrer = q.defer();
				deferrer.reject(new Error());
				return deferrer.promise;
			});
			api
				.push()
				.catch(function(){
					done();
				})
		});
	});

	describe('Merge function', function(){
		beforeEach(function(){
			api.__set__('Git.checkout', function(){
				var deferrer = q.defer();
				deferrer.resolve();
				return deferrer.promise;
			});
			api.__set__('Git.pull', function(){
				var deferrer = q.defer();
				deferrer.resolve();
				return deferrer.promise;
			});
			api.__set__('Git.merge', function(){
				var deferrer = q.defer();
				deferrer.resolve();
				return deferrer.promise;
			});
			api.__set__('version', '0.0.0');
		});
		it('check success promise', function(done){
			api.__set__('Git.push', function(){
				var deferrer = q.defer();
				deferrer.resolve();
				return deferrer.promise;
			});
			api
				.merge()
				.then(function(){
					done();
				})
		});
		it('check error promise', function(done){
			api.__set__('Git.push', function(){
				var deferrer = q.defer();
				deferrer.reject(new Error());
				return deferrer.promise;
			});
			api
				.merge()
				.catch(function(){
					done();
				})
		});
	});
});