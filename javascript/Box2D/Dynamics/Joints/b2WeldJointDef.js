var b2WeldJointDef = function() {
b2JointDef.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2WeldJointDef.prototype, b2JointDef.prototype)
b2WeldJointDef.prototype._super = b2JointDef.prototype;
b2WeldJointDef.prototype.__constructor = function () {
		this._super.__constructor.apply(this, arguments);
		this.type = b2Joint.e_weldJoint;
		this.referenceAngle = 0.0;
	}
b2WeldJointDef.prototype.__varz = function(){
this.localAnchorA =  new b2Vec2();
this.localAnchorB =  new b2Vec2();
}
// static methods
// static attributes
// methods
b2WeldJointDef.prototype.Initialize = function (bA, bB,
								anchor) {
		this.bodyA = bA;
		this.bodyB = bB;
		this.localAnchorA.SetV( this.bodyA.GetLocalPoint(anchor));
		this.localAnchorB.SetV( this.bodyB.GetLocalPoint(anchor));
		this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
	}
// attributes
b2WeldJointDef.prototype.localAnchorA =  new b2Vec2();
b2WeldJointDef.prototype.localAnchorB =  new b2Vec2();
b2WeldJointDef.prototype.referenceAngle =  null;