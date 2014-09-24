/**
 * New node file
 */

exports.Lex= function (stream){
	this.stream=stream;
	this.pos=0;
	this.line=0;
	this.col=0;
	this.lastToken=null;
	return this;
};

exports.Lex.prototype.advance=function(by){
	var inc=by || 1;
	this.pos+=inc;
		
	return this;
};

exports.Lex.prototype.matchFromList=function (list){
	var remaining=this.stream.slice(this.pos);
	var result=false;
	for(var i=0;i<list.length;i++){
		if(remaining.substr(0,list[i].length)==list[i]){
			result=list[i];
			break;
		}
	}
 
	return result;
}

exports.Lex.prototype.getToken= function (){
	this.lastToken=null;
 
	if(this.pos<this.stream.length)
		this.lastToken=this.stream.charAt(this.pos);
	 
	return this.lastToken;
};

exports.Lex.prototype.beginsWith=function(rx){
	var remaining=this.stream.slice(this.pos);
	var result=false;
	var match=remaining.match(rx); 
	
	result=(match && match[0]) || false;
	return result;
};

exports.Lex.prototype.getPos=function(){
	return this.pos;
}

 






	 