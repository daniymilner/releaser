var fs = require('fs-extra');

exports.readJSON = function(pathSrc){
	var data, json;
	if(exports.exists(pathSrc)){
		json = exports.readFileSync(pathSrc);
		try{
			data = JSON.parse(json);
		}catch(e){
			data = {};
		}
	}
	return data;
};

exports.writeJSON = function(pathDest, data, indent){
	return fs.writeFileSync(pathDest, JSON.stringify(data, null, indent));
};

exports.exists = function(){
	return [].every.call(arguments, fs.existsSync);
};

exports.readFileSync = function(pathSrc){
	return fs.readFileSync(pathSrc, 'utf8');
};

