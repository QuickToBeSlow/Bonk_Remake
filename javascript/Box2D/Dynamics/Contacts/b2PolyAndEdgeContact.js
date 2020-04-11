var b2PolyAndEdgeContact = function() {
b2Contact.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2PolyAndEdgeContact.prototype, b2Contact.prototype)
b2PolyAndEdgeContact.prototype._super = b2Contact.prototype;
b2PolyAndEdgeContact.prototype.__constructor = function(){this._super.__constructor.apply(this, arguments);}
b2PolyAndEdgeContact.prototype.__varz = function(){
}
// static methods
b2PolyAndEdgeContact.Create = function (allocator) {
		return new b2PolyAndEdgeContact();
	}
b2PolyAndEdgeContact.Destroy = function (contact, allocator) {
	}
// static attributes
// methods
b2PolyAndEdgeContact.prototype.Evaluate = function () {
		var bA = this.m_fixtureA.GetBody();
		var bB = this.m_fixtureB.GetBody();
		
		this.b2CollidePolyAndEdge(this.m_manifold,
					this.m_fixtureA.GetShape(), bA.m_xf, 
					this.m_fixtureB.GetShape(), bB.m_xf);
	}
b2PolyAndEdgeContact.prototype.b2CollidePolyAndEdge = function (manifold,
	 polygon, 
	 xf1,
	 edge, 
	 xf2) {
		
		
	}
b2PolyAndEdgeContact.prototype.Reset = function (fixtureA, fixtureB) {
		this._super.Reset.apply(this, [fixtureA, fixtureB]);
		b2Settings.b2Assert(fixtureA.GetType() == b2Shape.e_polygonShape);
		b2Settings.b2Assert(fixtureB.GetType() == b2Shape.e_edgeShape);
	}
// attributes