var b2EdgeChainDef = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2EdgeChainDef.prototype.__constructor = function () {
		
		this.vertexCount = 0;
		this.isALoop = true;
		this.vertices = [];
	}
b2EdgeChainDef.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
// attributes
b2EdgeChainDef.prototype.vertices =  null;
b2EdgeChainDef.prototype.vertexCount =  null;
b2EdgeChainDef.prototype.isALoop =  null;