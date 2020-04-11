var b2FixtureDef = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2FixtureDef.prototype.__constructor = function () {
		this.shape = null;
		this.userData = null;
		this.friction = 0.2;
		this.restitution = 0.0;
		this.density = 0.0;
		this.filter.categoryBits = 0x0001;
		this.filter.maskBits = 0xFFFF;
		this.filter.groupIndex = 0;
		this.isSensor = false;
	}
b2FixtureDef.prototype.__varz = function(){
this.filter =  new b2FilterData();
}
// static methods
// static attributes
// methods
// attributes
b2FixtureDef.prototype.shape =  null;
b2FixtureDef.prototype.userData =  null;
b2FixtureDef.prototype.friction =  null;
b2FixtureDef.prototype.restitution =  null;
b2FixtureDef.prototype.density =  null;
b2FixtureDef.prototype.isSensor =  null;
b2FixtureDef.prototype.filter =  new b2FilterData();