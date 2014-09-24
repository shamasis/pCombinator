var Lex=require("./lexer").Lex;

exports.Context=function (inputStream,lx){
	this.expected="";
	this.result=false;
	this.tokens=[];
	this.lexer=lx ||new Lex(inputStream);
	return this;
};

