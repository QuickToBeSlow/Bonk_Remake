var b2Jacobian = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Jacobian.prototype.__constructor = function(){}
b2Jacobian.prototype.__varz = function(){
this.linearA =  new b2Vec2();
this.linearB =  new b2Vec2();
}
// static methods
// static attributes
// methods
b2Jacobian.prototype.SetZero = function () {
		this.linearA.SetZero(); this.angularA = 0.0;
		this.linearB.SetZero(); this.angularB = 0.0;
	}
b2Jacobian.prototype.Set = function (x1, a1, x2, a2) {
		this.linearA.SetV(x1); this.angularA = a1;
		this.linearB.SetV(x2); this.angularB = a2;
	}
b2Jacobian.prototype.Compute = function (x1, a1, x2, a2) {
		
		
		return (this.linearA.x*x1.x + this.linearA.y*x1.y) + this.angularA * a1 + (this.linearB.x*x2.x + this.linearB.y*x2.y) + this.angularB * a2;
	}
// attributes
b2Jacobian.prototype.linearA =  new b2Vec2();
b2Jacobian.prototype.angularA =  null;
b2Jacobian.prototype.linearB =  new b2Vec2();
b2Jacobian.prototype.angularB =  null;