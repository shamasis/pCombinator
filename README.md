# pCombinator

 

A parser combinator in Javascript ( Node.js) for combining primitive parser functions to create simple DSLs

Writing the documentation for something like this is more complicated than writing the code! See the example file to get 
a hang on how to use this! 
## Objective

At the basic level it uses function composition to build larger recognizers from primitive ones. The parseUnit is similar
to a monad-ic unit function. it takes a function and  returns a function that take an context type ( context.js) as its argument and returns the same.

I don't know how useful such combinators are-- real languages require handling precedence and stack management to reduce 
grammar elements properly. But one can create recognizers fairly easily by using these techniques. 

If nothing else this can be a good study in functional programming techniques. 

Before calling any of the functions in pCombinator, a context has to be set up.

This is menat of node.js. Please ensure that the paths are correct in require();

## Usage

### 1. pCombinator.js. contains the core functions that enable creation of parser combinators

#### 1.1 parserUnit(parseExpr, tokenType,[optional tranformToken])

parameters:
    parserExp: can be any one of the following:
       - string e.g "=" or "+" etc
       - array of strings=["+","-"];
      - any regular expression. e.g /^[a-z]+$/ ( regex should begin with the ^)
      	example: /^(if|elseif|else)/ 
         
    tokenType: is a string - This will be stored in the type field of the token if the next token matches parserExpr.
    transformToken: a function that takes a token type as arguments and returns thes same type ( token.js)
    
  Returns:
  
  a function that takes a context type as argument and returns a context type. ( See context.js for context type). context.result wil be true if the current last token matches the parserEXpr. ( confusing? check examples.js)

Example: 
var digit=parserUnit(["1","2","3","4","5","6","7","8","9","0"],"DIGIT");
 
var letter=parserUnit(/^[A-Za-z]/,"LETTER");


	digit, letter are functions that take a Context type as an arguent. 
	You call them in the following way :
	
	result=digit(new Context('1'));  result.result-> true, result->tokens[0].value='1'
									result.token[0].type='DIGIT';
	result=digit(new Context('a')); result.result-> false;
	result=letter(new Context('a')); result.result=true, result.tokens[0].value='a';

Using the transform function:
	someFun= function(tok){ tok.value=tok.value.toUpperCase(); return tok;}
	letterCaps=parserUnit(/^[A-Za-z]/,"LETTER",someFun);
	result=letter(new Context('a')); result.result=true, result.tokens[0].value='A';<---
	
 
#### 1.2 or(tokenType, reduce,fn,alt)

parameters: 
  	tokenType- string same as in anyother function
  	reduce- a function that takes a 'token' as paramter ( token.js) amd returns anothertoken type. 
          or null

  	fn - function  that returns a context when a context is supplied to it
  	alt- same type as fn
  
	returns:   a function that takes a context type as argument and returns a context type.

examples:

  	var digit=parserUnit(["1","2","3","4","5","6","7","8","9","0"],"DIGIT"); 
	var letter=parserUnit(/^[A-Za-z]/,"LETTER");
	var letterOrDigit=or("LettrOrDigit",null,letter,digit);
	
	digit, letter and letterOrDigit are functions.
	
	var con= new Context('1');
	result=letterOrDigit(context); result.result= true; result.token[0]='1';
	  							   result.type='LetterOrDigit';
	con.stream='a';
	result=letterOrDigit(context); result.result= true; result.token[0]='a';
	  							   result.type='LetterOrDigit';
	con.stream='_';
	result=letterOrDigit(context); result.result= false;  
								   result.expected="LetterOrDigit');
								   
	 
 	reduce function can also be used in the same manner as the tranform argument above for modifying 
 	the token in some way before it is pushed to the result.tokens.								
	
#### 1.3 zeroOrMore(fn,tokenType,tranformToken)

returns a function that looks for a token defined by fn and creates a token of tokenType.
Since this is detects zero or more occurrences it the returned context will always have its 
result attribute as true.
The returned context will have a tokens member that will have a list of tokens that were found.
tranformToken is a function ( if not null or not passed as a parameter) that will tranform  the token in 
some manner. gets a token ( token.js) as its paarmeter and must return the same type.

examples:

zeroOrMoreDigits= zeroOrMore(digits,"someOrNoDigits"); 
result= zeroOrMoreDigits(new Context("100")); 
		result.result-> true
			result.token[0].value=null;
			result.token[0].type="someOrNoDigits";
			result.tokens[0].children[0]=<token> {value: '1', children=[]}
			result.tokens[0].children[1]=<token> {value: '0',children=[]}
			result.tokens[0].children[2]=<token> {value: '0',children=[]}

The type token has a usefule member function that can merge the values of the children and 
assign it to its value own value field.

			result.token[0].mergeChildren();
			-> result[0].token[0]-> value="100"
			                     -> children=[];
Generally, a function which does this can be passed as the tranform function.
	zeroOrMoredigits= zeroOrMore(digits,"someOrNoDigits",
										 function (tok){
										 tok.mergeChildren();
										 return tok;
										 })

Now,

result= zeroOrMoreDigits(new Context("100")); 
		result.result-> true
			result.tokens[0].value="100";
			result.tones[0].type="someOrNoDigits";
		
#### 1.4 sequence(tokenType,transformToken, fn1,fn2,fn3....)

As the name suggest those function composes a function out of the fn1, fn2  fn3 .. etc'
Tokentype and tranformToken are the same as for zeroOrMore() above.

Examples:

var merge=function(tok) { tok.mergeChildren(); return tok;}
var digit=parserUnit(["1","2","3","4","5","6","7","8","9","0"],"DIGIT"); 
var letter=parserUnit(/^[A-Za-z]/,"LETTER");
var letterOrDigit=or("LettrOrDigit",null,letter,digit);
var someOrNoLettersOrDigits= zeroOrMore(letterOrDigit,"someLettersOrDigits",merge);
										
										
	
var identifier=sequence("Identifier",merge,letter,somrOrNoLettersOrDigits);

 	result= identifier(new Context("Aa1");
 		result.result=true;
 		result.tokens[0].value="Aa1";
 		
#### 1.5 oneOf(tokenType,transformToken, fn1,fn2,fn3...)

works exactly like or() above except with more than 2 functions .
In fact or() is just a syntactic sugar function that calls oneOf with two functions.

#### 1.6 zeroOrOne(fn,tokenType,tranformToken)

Works like zeroOrMore above- except matches only one instance or zero. In both cases it returns true.
#### 1.7 oneOrMore(fn,tokentype, transformToken)

Works like zeroOrMore or zeroOrOne
Returns true only if at least one match is found
### 2. lexer.js

Defines a simple lexical analyser has the following functions

constuctor Lex(Stream);
 usage: lex= new Lex("a1+b1");
 
 getToken()-> returns the character at the current position. returns null if end of string;
 advance(by)-> increments the current pos by 'by' or 1;
 matchInList(array of strings); -> checks if the string athe the current pos matches any of the strings
 								  in the array. returns the matching element of the array or false;
 beginsWith(regex) -> checks if the string at currentpos begins with  regex and returns the match string
 					or false;
 getPos()-> returns the current position of the stream;
 								  
 the Context object creates a lexer with the stream passed to it and stores it in its member field lexer.
 You can create your own lexer and and bind this to context by passing it as the second argument to the 
 constructor.
 
 	ex:  ctxt= new Context(inputStream, new mylexer());
 	
 Please ensure that yoru lexer has the same member functions as above with the same signatures!
							
### 3. Context.js
Trivial
 usage:
 
 ct=new context("id1");
 
 var result=idetifier(context);
 
 if(result.result)
 	console.log(context.token[0].toString());
 else 
 	console.log("expected "+ result.expected + " found "+ result.lexer.getToken()  + " at: "+ result.lexer.getPos());
 

4. token.js

Trivial. Please read the code to understand.

members:

Type
value
children= array oftokens
mergeChildren()-> merges teh values of children and puts it into value. also makes the children into an
 array with no members;


## Developing



### Tools

Created with [Nodeclipse v0.5](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   
