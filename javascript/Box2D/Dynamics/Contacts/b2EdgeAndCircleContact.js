var b2EdgeAndCircleContact = function() {
b2Contact.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2EdgeAndCircleContact.prototype, b2Contact.prototype)
b2EdgeAndCircleContact.prototype._super = b2Contact.prototype;
b2EdgeAndCircleContact.prototype.__constructor = function(){this._super.__constructor.apply(this, arguments);}
b2EdgeAndCircleContact.prototype.__varz = function(){
}
// static methods
b2EdgeAndCircleContact.Create = function (allocator) {
		return new b2EdgeAndCircleContact();
	}
b2EdgeAndCircleContact.Destroy = function (contact, allocator) {
		
	}
// static attributes
// methods
b2EdgeAndCircleContact.prototype.Evaluate = function () {
		var bA = this.m_fixtureA.GetBody();
		var bB = this.m_fixtureB.GetBody();
		this.b2CollideEdgeAndCircle(this.m_manifold,
					this.m_fixtureA.GetShape(), bA.m_xf,
					this.m_fixtureB.GetShape(), bB.m_xf);
	}
b2EdgeAndCircleContact.prototype.b2CollideEdgeAndCircle = function (manifold,
	 edge, 
	 xf1,
	 circle, 
	 xf2) {
		
		
	}
b2EdgeAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
		this._super.Reset.apply(this, [fixtureA, fixtureB]);
		
		
	}
// attributes