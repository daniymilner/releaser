var rewire = require("rewire"),
	expect = require('chai').expect;

describe('Filesystem', function(){
	var filesystem = rewire('../utils/filesystem.js'),
		json = '{"a":1}',
		notValidJson = '{a}';

	filesystem.__set__('fs', {
		readFileSync: function(){
			return json;
		},
		existsSync: function(){
			return true;
		},
		writeFileSync: function(){
			return true;
		}
	});

	it('readFileSync', function(){
		var data = filesystem.readFileSync();
		expect(data).to.be.equal(json);
	});

	it('exists', function(){
		var data = filesystem.exists();
		expect(data).to.be.true;
	});

	it('writeJSON', function(){
		var data = filesystem.writeJSON();
		expect(data).to.be.true;
	});

	describe('readJSON', function(){
		it('success reading', function(){
			var data = filesystem.readJSON();
			expect(data).not.to.be.null;
			expect(data.a).to.be.equal(JSON.parse(json).a);
		});

		it('not valid json', function(){
			filesystem.__set__('exports.readFileSync', function(){
				return notValidJson;
			});
			filesystem.__set__('exports.exists', function(){
				return true;
			});
			var data = filesystem.readJSON();
			expect(data).to.be.empty;
		});

		it('file not exists', function(){
			filesystem.__set__('exports.exists', function(){
				return false;
			});
			var data = filesystem.readJSON();
			expect(data).to.be.empty;
		});
	});
});