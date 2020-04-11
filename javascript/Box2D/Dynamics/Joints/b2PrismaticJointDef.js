var b2PrismaticJointDef = function() {
b2JointDef.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2PrismaticJointDef.prototype, b2JointDef.prototype)
b2PrismaticJointDef.prototype._super = b2JointDef.prototype;
b2PrismaticJointDef.prototype.__constructor = function () {
		this._super.__constructor.apply(this, arguments);
		this.type = b2Joint.e_prismaticJoint;
		
		
		this.localAxisA.Set(1.0, 0.0);
		this.referenceAngle = 0.0;
		this.enableLimit = false;
		this.lowerTranslation = 0.0;
		this.upperTranslation = 0.0;
		this.enableMotor = false;
		this.maxMotorForce = 0.0;
		this.motorSpeed = 0.0;
	}
b2PrismaticJointDef.prototype.__varz = function(){
this.localAnchorA =  new b2Vec2();
this.localAnchorB =  new b2Vec2();
this.localAxisA =  new b2Vec2();
}
// static methods
// static attributes
// methods
b2PrismaticJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
		this.bodyA = bA;
		this.bodyB = bB;
		this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
		this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
		this.localAxisA = this.bodyA.GetLocalVector(axis);
		this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
	}
// attributes
b2PrismaticJointDef.prototype.localAnchorA =  new b2Vec2();
b2PrismaticJointDef.prototype.localAnchorB =  new b2Vec2();
b2PrismaticJointDef.prototype.localAxisA =  new b2Vec2();
b2PrismaticJointDef.prototype.referenceAngle =  null;
b2PrismaticJointDef.prototype.enableLimit =  null;
b2PrismaticJointDef.prototype.lowerTranslation =  null;
b2PrismaticJointDef.prototype.upperTranslation =  null;
b2PrismaticJointDef.prototype.enableMotor =  null;
b2PrismaticJointDef.prototype.maxMotorForce =  null;
b2PrismaticJointDef.prototype.motorSpeed =  null;