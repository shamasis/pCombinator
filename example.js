/**
 * New node file
 */
var cparser=require("./pCombinator.js");
 
var Context=require("./context.js").Context;

var parserUnit=cparser.parserUnit;
var or=cparser.or;
var zeroOrMore=cparser.zeroOrMore;
var sequence=cparser.sequence;
var oneOf=cparser.oneOf;


var inputStream= "100";
var context=new Context(inputStream);
 

var mergeTokens=function(tok){
	return tok.mergeChildren();
};

var reduce=mergeTokens; //set this to null to see the comple tree of tokens in 
                        //result.tokens[0]

var digit=parserUnit(["1","2","3","4","5","6","7","8","9","0"],"DIGIT");
var operator=parserUnit(["+","-","*","/","%"],"ARITH_OP");
var letter=parserUnit(/^[A-Za-z]/,"LETTER");
var letterOrDigit=oneOf("letterOrDigit",null,letter,digit);

//num is a sequence of digit followed by zero or more digits
var num=sequence("Number",reduce,digit,zeroOrMore(digit,"zeroOrMoreDigits",reduce));
var identifier=sequence("IDENTIFIER",reduce,letter,zeroOrMore(letterOrDigit,"manyLettersOrDigits",reduce));
//define term as an one of [identifier, num]
var term= oneOf("TERM",reduce,identifier,num);
//define expression as a sequence of terme, operator and term
var expr=sequence("EXPR",null,term,operator,term);
 

//Test function
 function test(str){
	var result= expr(new Context(str)); // change the string "a1+b1" to test
	if(result.result)
			console.log("Success"+ result.tokens[0]);
	else console.log("Error: expected:"+ result.expected +  " At : "+
					result.lexer.getPos()+ " found= "+result.lexer.getToken());
}

test("a1+a2"); //correct

test("a1+100"); //correct
 
test("a1"); //->error;
