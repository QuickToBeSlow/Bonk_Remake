var b2ContactConstraintPoint = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2ContactConstraintPoint.prototype.__constructor = function(){}
b2ContactConstraintPoint.prototype.__varz = function(){
this.localPoint = new b2Vec2();
this.rA = new b2Vec2();
this.rB = new b2Vec2();
}
// static methods
// static attributes
// methods
// attributes
b2ContactConstraintPoint.prototype.localPoint = new b2Vec2();
b2ContactConstraintPoint.prototype.rA = new b2Vec2();
b2ContactConstraintPoint.prototype.rB = new b2Vec2();
b2ContactConstraintPoint.prototype.normalImpulse =  null;
b2ContactConstraintPoint.prototype.tangentImpulse =  null;
b2ContactConstraintPoint.prototype.normalMass =  null;
b2ContactConstraintPoint.prototype.tangentMass =  null;
b2ContactConstraintPoint.prototype.equalizedMass =  null;
b2ContactConstraintPoint.prototype.velocityBias =  null;