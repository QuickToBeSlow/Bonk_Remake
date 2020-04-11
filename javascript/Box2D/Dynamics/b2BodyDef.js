var b2BodyDef = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2BodyDef.prototype.__constructor = function () {
		this.userData = null;
		this.position.Set(0.0, 0.0);
		this.angle = 0.0;
		this.linearVelocity.Set(0, 0);
		this.angularVelocity = 0.0;
		this.linearDamping = 0.0;
		this.angularDamping = 0.0;
		this.allowSleep = true;
		this.awake = true;
		this.fixedRotation = false;
		this.bullet = false;
		this.type = b2Body.b2_staticBody;
		this.active = true;
		this.inertiaScale = 1.0;
	}
b2BodyDef.prototype.__varz = function(){
this.position =  new b2Vec2();
this.linearVelocity =  new b2Vec2();
}
// static methods
// static attributes
// methods
// attributes
b2BodyDef.prototype.type =  0;
b2BodyDef.prototype.position =  new b2Vec2();
b2BodyDef.prototype.angle =  null;
b2BodyDef.prototype.linearVelocity =  new b2Vec2();
b2BodyDef.prototype.angularVelocity =  null;
b2BodyDef.prototype.linearDamping =  null;
b2BodyDef.prototype.angularDamping =  null;
b2BodyDef.prototype.allowSleep =  null;
b2BodyDef.prototype.awake =  null;
b2BodyDef.prototype.fixedRotation =  null;
b2BodyDef.prototype.bullet =  null;
b2BodyDef.prototype.active =  null;
b2BodyDef.prototype.userData =  null;
b2BodyDef.prototype.inertiaScale =  null;