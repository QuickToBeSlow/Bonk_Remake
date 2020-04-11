var b2PolygonContact = function() {
b2Contact.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2PolygonContact.prototype, b2Contact.prototype)
b2PolygonContact.prototype._super = b2Contact.prototype;
b2PolygonContact.prototype.__constructor = function(){this._super.__constructor.apply(this, arguments);}
b2PolygonContact.prototype.__varz = function(){
}
// static methods
b2PolygonContact.Create = function (allocator) {
		
		return new b2PolygonContact();
	}
b2PolygonContact.Destroy = function (contact, allocator) {
		
		
	}
// static attributes
// methods
b2PolygonContact.prototype.Evaluate = function () {
		var bA = this.m_fixtureA.GetBody();
		var bB = this.m_fixtureB.GetBody();

		b2Collision.CollidePolygons(this.m_manifold, 
					this.m_fixtureA.GetShape(), bA.m_xf, 
					this.m_fixtureB.GetShape(), bB.m_xf);
	}
b2PolygonContact.prototype.Reset = function (fixtureA, fixtureB) {
		this._super.Reset.apply(this, [fixtureA, fixtureB]);
		
		
	}
// attributes