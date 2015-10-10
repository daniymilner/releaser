var rewire = require("rewire"),
	expect = require('chai').expect,
	q = require('q');

describe('Git API', function(){
	var gitApi,
		branch = 'develop',
		tag = '0.0.0';

	beforeEach(function(){
		gitApi = rewire('../utils/git-api.js');
		gitApi.__set__('exec', function(str){
			var deferrer = q.defer();
			if(str){
				deferrer.resolve(str);
			}else{
				deferrer.reject(new Error(gitApi.messages.emptyCommand));
			}
			return deferrer.promise;
		});
	});

	it('add', function(done){
		gitApi
			.add()
			.then(function(res){
				expect(res).to.be.equal(gitApi.commands.add);
				done();
			})
	});

	it('commit empty message', function(done){
		gitApi
			.commit()
			.catch(function(err){
				expect(err).not.to.be.null;
				expect(err.message).to.be.equal(gitApi.messages.emptyMessage);
				done();
			})
	});

	it('commit valid message', function(done){
		var message = 'some commit';
		gitApi
			.commit(message)
			.then(function(res){
				expect(res).to.be.equal(gitApi.commands.getCommit(message));
				done();
			})
	});

	it('add empty tag', function(done){
		gitApi
			.addTag()
			.catch(function(err){
				expect(err).not.to.be.null;
				expect(err.message).to.be.equal(gitApi.messages.emptyTag);
				done();
			})
	});

	it('add valid tag', function(done){
		gitApi
			.addTag(tag)
			.then(function(res){
				expect(res).to.be.equal(gitApi.commands.getTag(tag));
				done();
			})
	});

	it('push branch', function(done){
		gitApi
			.push(branch)
			.then(function(res){
				expect(res).to.be.equal(gitApi.commands.getPush(branch));
				done();
			})
	});

	it('push all branches', function(done){
		gitApi
			.push()
			.then(function(res){
				expect(res).to.be.equal(gitApi.commands.push);
				done();
			})
	});

	it('push tag', function(done){
		gitApi
			.pushTag(tag)
			.then(function(res){
				expect(res).to.be.equal(gitApi.commands.getPush(tag));
				done();
			})
	});

	it('push all tags', function(done){
		gitApi
			.pushTag()
			.then(function(res){
				expect(res).to.be.equal(gitApi.commands.getPush(gitApi.commands.tags));
				done();
			})
	});

	it('push all branches and tags', function(done){
		gitApi
			.pushAll()
			.then(function(){
				done();
			})
	});

	it('checkout empty branch', function(done){
		gitApi
			.checkout()
			.catch(function(err){
				expect(err).not.to.be.null;
				expect(err.message).to.be.equal(gitApi.messages.emptyBranch);
				done();
			})
	});

	it('checkout valid branch', function(done){
		gitApi
			.checkout(branch)
			.then(function(res){
				expect(res).to.be.equal(gitApi.commands.getCheckout(branch));
				done();
			})
	});

	it('pull empty branch', function(done){
		gitApi
			.pull()
			.catch(function(err){
				expect(err).not.to.be.null;
				expect(err.message).to.be.equal(gitApi.messages.emptyBranch);
				done();
			})
	});

	it('pull valid branch', function(done){
		gitApi
			.pull(branch)
			.then(function(res){
				expect(res).to.be.equal(gitApi.commands.getPull(branch));
				done();
			})
	});

	it('merge empty branch', function(done){
		gitApi
			.merge()
			.catch(function(err){
				expect(err).not.to.be.null;
				expect(err.message).to.be.equal(gitApi.messages.emptyBranch);
				done();
			})
	});

	it('merge valid branch', function(done){
		gitApi
			.merge(branch)
			.then(function(res){
				expect(res).to.be.equal(gitApi.commands.getMerge(branch));
				done();
			})
	});
});