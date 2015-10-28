var rewire = require("rewire"),
	chai = require('chai'),
	q = require('q'),
	expect = chai.expect,
	chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

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

	it('add', function(){
		return expect(gitApi.add()).eventually.equal(gitApi.commands.add);
	});

	it('commit empty message', function(){
		return expect(gitApi.commit()).to.be.rejectedWith(gitApi.messages.emptyMessage);
	});

	it('commit valid message', function(){
		var message = 'some commit';
		return expect(gitApi.commit(message)).eventually.equal(gitApi.commands.getCommit(message));
	});

	it('add empty tag', function(){
		return expect(gitApi.addTag()).to.be.rejectedWith(gitApi.messages.emptyTag);
	});

	it('add valid tag', function(){
		return expect(gitApi.addTag(tag)).eventually.equal(gitApi.commands.getTag(tag));
	});

	it('push branch', function(){
		return expect(gitApi.push(branch)).eventually.equal(gitApi.commands.getPush(branch));
	});

	it('push all branches', function(){
		return expect(gitApi.push()).eventually.equal(gitApi.commands.push);
	});

	it('push tag', function(){
		return expect(gitApi.pushTag(tag)).eventually.equal(gitApi.commands.getPush(tag));
	});

	it('push all tags', function(){
		return expect(gitApi.pushTag()).eventually.equal(gitApi.commands.getPush(gitApi.commands.tags));
	});

	it('push all branches and tags', function(){
		return expect(gitApi.pushAll()).be.fulfilled;
	});

	it('checkout empty branch', function(){
		return expect(gitApi.checkout()).to.be.rejectedWith(gitApi.messages.emptyBranch);
	});

	it('checkout valid branch', function(){
		return expect(gitApi.checkout(branch)).eventually.equal(gitApi.commands.getCheckout(branch));
	});

	it('pull empty branch', function(){
		return expect(gitApi.pull()).to.be.rejectedWith(gitApi.messages.emptyBranch);
	});

	it('pull valid branch', function(){
		return expect(gitApi.pull(branch)).eventually.equal(gitApi.commands.getPull(branch));
	});

	it('merge empty branch', function(){
		return expect(gitApi.merge()).to.be.rejectedWith(gitApi.messages.emptyBranch);
	});

	it('merge valid branch', function(){
		return expect(gitApi.merge(branch)).eventually.equal(gitApi.commands.getMerge(branch));
	});
});