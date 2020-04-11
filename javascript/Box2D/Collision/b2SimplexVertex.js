var b2SimplexVertex = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2SimplexVertex.prototype.__constructor = function(){}
b2SimplexVertex.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
b2SimplexVertex.prototype.Set = function (other) {
		this.wA.SetV(other.wA);
		this.wB.SetV(other.wB);
		this.w.SetV(other.w);
		this.a = other.a;
		this.indexA = other.indexA;
		this.indexB = other.indexB;
	}
// attributes
b2SimplexVertex.prototype.wA =  null;
b2SimplexVertex.prototype.wB =  null;
b2SimplexVertex.prototype.w =  null;
b2SimplexVertex.prototype.a =  null;
b2SimplexVertex.prototype.indexA =  0;
b2SimplexVertex.prototype.indexB =  0;