exports.Token=function (type,value){
	this.type=type || null;
	this.children=[];
	this.value=value ||null;
};

exports.Token.prototype.mergeChildren=function(){
	var i;
	if(this.children.length>0){
		this.value="";
		for(i=0;i<this.children.length;i++)
			this.value+=this.children[i].value;
	 
		this.children=[];
	}
	return this;
};

 

exports.Token.prototype.pretty= function(depth){
	var result;
	var pad="  ";
	for(var i=0;i<depth;i++)
		pad+=pad;
	result="  Type="+this.type+ " Value: "+ this.value +"\n";
	for(i=0;i<this.children.length;i++){
		result+=pad+"C"+i;
		result+=this.children[i].pretty(depth+1)+"\n";
	}	
return result;
}
	
exports.Token.prototype.toString=function(){
	return this.pretty(0);
}

 