var b2Point = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Point.prototype.__constructor = function(){}
b2Point.prototype.__varz = function(){
this.p =  new b2Vec2();
}
// static methods
// static attributes
// methods
b2Point.prototype.Support = function (xf, vX, vY) {
		return this.p;
	}
b2Point.prototype.GetFirstVertex = function (xf) {
		return this.p;
	}
// attributes
b2Point.prototype.p =  new b2Vec2();