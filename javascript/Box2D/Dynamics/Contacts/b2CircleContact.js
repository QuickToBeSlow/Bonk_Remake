var b2CircleContact = function() {
b2Contact.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2CircleContact.prototype, b2Contact.prototype)
b2CircleContact.prototype._super = b2Contact.prototype;
b2CircleContact.prototype.__constructor = function(){this._super.__constructor.apply(this, arguments);}
b2CircleContact.prototype.__varz = function(){
}
// static methods
b2CircleContact.Create = function (allocator) {
		return new b2CircleContact();
	}
b2CircleContact.Destroy = function (contact, allocator) {
		
	}
// static attributes
// methods
b2CircleContact.prototype.Evaluate = function () {
		var bA = this.m_fixtureA.GetBody();
		var bB = this.m_fixtureB.GetBody();
		
		b2Collision.CollideCircles(this.m_manifold, 
					this.m_fixtureA.GetShape(), bA.m_xf, 
					this.m_fixtureB.GetShape(), bB.m_xf);
	}
b2CircleContact.prototype.Reset = function (fixtureA, fixtureB) {
		this._super.Reset.apply(this, [fixtureA, fixtureB]);
		
		
	}
// attributes