var b2LineJointDef = function() {
b2JointDef.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2LineJointDef.prototype, b2JointDef.prototype)
b2LineJointDef.prototype._super = b2JointDef.prototype;
b2LineJointDef.prototype.__constructor = function () {
		this._super.__constructor.apply(this, arguments);
		this.type = b2Joint.e_lineJoint;
		
		
		this.localAxisA.Set(1.0, 0.0);
		this.enableLimit = false;
		this.lowerTranslation = 0.0;
		this.upperTranslation = 0.0;
		this.enableMotor = false;
		this.maxMotorForce = 0.0;
		this.motorSpeed = 0.0;
	}
b2LineJointDef.prototype.__varz = function(){
this.localAnchorA =  new b2Vec2();
this.localAnchorB =  new b2Vec2();
this.localAxisA =  new b2Vec2();
}
// static methods
// static attributes
// methods
b2LineJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
		this.bodyA = bA;
		this.bodyB = bB;
		this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
		this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
		this.localAxisA = this.bodyA.GetLocalVector(axis);
	}
// attributes
b2LineJointDef.prototype.localAnchorA =  new b2Vec2();
b2LineJointDef.prototype.localAnchorB =  new b2Vec2();
b2LineJointDef.prototype.localAxisA =  new b2Vec2();
b2LineJointDef.prototype.enableLimit =  null;
b2LineJointDef.prototype.lowerTranslation =  null;
b2LineJointDef.prototype.upperTranslation =  null;
b2LineJointDef.prototype.enableMotor =  null;
b2LineJointDef.prototype.maxMotorForce =  null;
b2LineJointDef.prototype.motorSpeed =  null;