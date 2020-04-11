var b2PolyAndCircleContact = function() {
b2Contact.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2PolyAndCircleContact.prototype, b2Contact.prototype)
b2PolyAndCircleContact.prototype._super = b2Contact.prototype;
b2PolyAndCircleContact.prototype.__constructor = function(){this._super.__constructor.apply(this, arguments);}
b2PolyAndCircleContact.prototype.__varz = function(){
}
// static methods
b2PolyAndCircleContact.Create = function (allocator) {
		return new b2PolyAndCircleContact();
	}
b2PolyAndCircleContact.Destroy = function (contact, allocator) {
	}
// static attributes
// methods
b2PolyAndCircleContact.prototype.Evaluate = function () {
		var bA = this.m_fixtureA.m_body;
		var bB = this.m_fixtureB.m_body;
		
		b2Collision.CollidePolygonAndCircle(this.m_manifold, 
					this.m_fixtureA.GetShape(), bA.m_xf, 
					this.m_fixtureB.GetShape(), bB.m_xf);
	}
b2PolyAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
		this._super.Reset.apply(this, [fixtureA, fixtureB]);
		b2Settings.b2Assert(fixtureA.GetType() == b2Shape.e_polygonShape);
		b2Settings.b2Assert(fixtureB.GetType() == b2Shape.e_circleShape);
	}
// attributes