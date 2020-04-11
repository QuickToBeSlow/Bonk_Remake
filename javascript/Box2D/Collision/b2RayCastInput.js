var b2RayCastInput = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2RayCastInput.prototype.__constructor = function (p1 , p2 , maxFraction ) {
			if (p1)
				this.p1.SetV(p1);
			if (p2)
				this.p2.SetV(p2);
			if (maxFraction)
				this.maxFraction = maxFraction;
		}
b2RayCastInput.prototype.__varz = function(){
this.p1 =  new b2Vec2();
this.p2 =  new b2Vec2();
}
// static methods
// static attributes
// methods
// attributes
b2RayCastInput.prototype.p1 =  new b2Vec2();
b2RayCastInput.prototype.p2 =  new b2Vec2();
b2RayCastInput.prototype.maxFraction =  null;