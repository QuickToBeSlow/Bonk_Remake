var b2PulleyJointDef = function() {
b2JointDef.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2PulleyJointDef.prototype, b2JointDef.prototype)
b2PulleyJointDef.prototype._super = b2JointDef.prototype;
b2PulleyJointDef.prototype.__constructor = function () {
		this._super.__constructor.apply(this, arguments);
		this.type = b2Joint.e_pulleyJoint;
		this.groundAnchorA.Set(-1.0, 1.0);
		this.groundAnchorB.Set(1.0, 1.0);
		this.localAnchorA.Set(-1.0, 0.0);
		this.localAnchorB.Set(1.0, 0.0);
		this.lengthA = 0.0;
		this.maxLengthA = 0.0;
		this.lengthB = 0.0;
		this.maxLengthB = 0.0;
		this.ratio = 1.0;
		this.collideConnected = true;
	}
b2PulleyJointDef.prototype.__varz = function(){
this.groundAnchorA =  new b2Vec2();
this.groundAnchorB =  new b2Vec2();
this.localAnchorA =  new b2Vec2();
this.localAnchorB =  new b2Vec2();
}
// static methods
// static attributes
// methods
b2PulleyJointDef.prototype.Initialize = function (bA, bB,
				gaA, gaB,
				anchorA, anchorB,
				r) {
		this.bodyA = bA;
		this.bodyB = bB;
		this.groundAnchorA.SetV( gaA );
		this.groundAnchorB.SetV( gaB );
		this.localAnchorA = this.bodyA.GetLocalPoint(anchorA);
		this.localAnchorB = this.bodyB.GetLocalPoint(anchorB);
		
		var d1X = anchorA.x - gaA.x;
		var d1Y = anchorA.y - gaA.y;
		
		this.lengthA = Math.sqrt(d1X*d1X + d1Y*d1Y);
		
		
		var d2X = anchorB.x - gaB.x;
		var d2Y = anchorB.y - gaB.y;
		
		this.lengthB = Math.sqrt(d2X*d2X + d2Y*d2Y);
		
		this.ratio = r;
		
		var C = this.lengthA + this.ratio * this.lengthB;
		this.maxLengthA = C - this.ratio * b2PulleyJoint.b2_minPulleyLength;
		this.maxLengthB = (C - b2PulleyJoint.b2_minPulleyLength) / this.ratio;
	}
// attributes
b2PulleyJointDef.prototype.groundAnchorA =  new b2Vec2();
b2PulleyJointDef.prototype.groundAnchorB =  new b2Vec2();
b2PulleyJointDef.prototype.localAnchorA =  new b2Vec2();
b2PulleyJointDef.prototype.localAnchorB =  new b2Vec2();
b2PulleyJointDef.prototype.lengthA =  null;
b2PulleyJointDef.prototype.maxLengthA =  null;
b2PulleyJointDef.prototype.lengthB =  null;
b2PulleyJointDef.prototype.maxLengthB =  null;
b2PulleyJointDef.prototype.ratio =  null;