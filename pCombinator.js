


 var token=require("./token");
 var Token=token.Token;
 
exports.parserUnit=function(parserExpr, tokenType,transformToken){
	return function(context){
	 
		var token=context.lexer.getToken();
		if(!token){
			 
			context.result=false;
			return context;
		}
		 
		 
		if(parserExpr instanceof Array ){
			context.result= context.lexer.matchFromList(parserExpr);
			token=context.result || token;
			 
		}
		else if(parserExpr instanceof RegExp){
			context.result=context.lexer.beginsWith(parserExpr);
			token=context.result || token;
		}
		else if(parserExpr instanceof String)
			context.result=(token===parserExpr);
		
		context.expected=tokenType;
		context.found=token;
	 
		
		if(context.result){
			var tok=new Token(tokenType, token);
			if(transformToken)
				tok=transformToken(tok,context);
			context.tokens.push(tok);
			context.lexer.advance(token.length);
			}
		return context;
	};
};

exports.or=function (tokenType, transformToken,fn,alt){
	return exports.oneOf(tokenType,transformToken, fn,alt);
};

 

exports.zeroOrMore=function (fn,tokenType,transformToken){
	return function(context){
		var count=0;
		var tok;
		context=fn(context);
		while(context.result){
			count++;
			context=fn(context);
			}
		
		if(count){
			tok=new Token(tokenType);
			
			for(var i=0;i<count;i++){
				tok.children[i]=context.tokens.pop();
				}
			tok.children=tok.children.reverse();
			
			if(transformToken)
				tok=transformToken(tok,context);
			context.tokens.push(tok);
		}
		else {
			tok=new Token(tokenType);
			tok.type=tokenType;
			tok.value='';
			context.tokens.push(tok);
		}
		context.result=true;
		context.expected=tokenType;
		return context;
	};
};

exports.oneOrMore=function (fn,tokenType,transformToken){
	return function(context){
		var count=0;
		var tok;
		context=fn(context);
		while(context.result){
			count++;
			context=fn(context);
			}
		
		if(count){
			tok=new Token(tokenType);
			context.result=true;
			for(var i=0;i<count;i++){
				tok.children[i]=context.tokens.pop();
				}
			tok.children=tok.children.reverse();
			
			if(transformToken)
				tok=transformToken(tok,context);
			context.tokens.push(tok);
		}
		else 
			 context.result=false;
		context.expected=tokenType;
		return context;
	};
};

exports.zeroOrOne=function (fn,tokenType,transformToken){
	return function(context){
		var tok;
		context=fn(context);
		
		if(context.result){
			tok=context.tokens.pop();
			tok.type=tokenType || tok.type;
			if(transformToken)
				tok=transformToken(tok,context);
			 
		}
		else {
			tok=new Token(tokenType);
		
			tok.value='';
			 
		}
		context.result=true;
		context.expected=tokenType;
		context.tokens.push(tok);
		return context;
	};
};

exports.sequence=function(tokenType,transformToken){
	var args= Array.prototype.slice.call(arguments,2);
	return function (context){
		var count=0;
		for(var i=0;i<args.length;i++){
			context=args[i](context);
			if(!context.result) 
				break;
			count++;
		}
		
		
		if(context.result){
			
			var tok=new Token(tokenType);
			for(i=0;i<count;i++){
				tok.children[i]=context.tokens.pop();
				}
			tok.children=tok.children.reverse();
			 
			if(transformToken)
				tok=transformToken(tok,context);
			context.tokens.push(tok); 
		}
		
	context.expected=tokenType;
	return context;
	};
};
	

exports.oneOf= function(tokenType,transformToken){
	var args= Array.prototype.slice.call(arguments,2);
	return function(context){
		var i;
		context.result=false;
		for(i=0;i<args.length;i++){
			context=args[i](context);
			if(context.result)
				break;
		}
		if(context.result){
			var tok=new Token(tokenType);
			tok.children[0]=context.tokens.pop();
			tok.value=tok.children[0].value;
			if(transformToken)
				tok=transformToken(tok,context);
			context.tokens.push(tok);
			
		}
		context.expected=tokenType;
		return context;
		
	};
	
};
