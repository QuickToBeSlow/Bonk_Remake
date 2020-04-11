var b2DistanceJointDef = function() {
b2JointDef.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2DistanceJointDef.prototype, b2JointDef.prototype)
b2DistanceJointDef.prototype._super = b2JointDef.prototype;
b2DistanceJointDef.prototype.__constructor = function () {
		this._super.__constructor.apply(this, arguments);
		this.type = b2Joint.e_distanceJoint;
		
		
		this.length = 1.0;
		this.frequencyHz = 0.0;
		this.dampingRatio = 0.0;
	}
b2DistanceJointDef.prototype.__varz = function(){
this.localAnchorA =  new b2Vec2();
this.localAnchorB =  new b2Vec2();
}
// static methods
// static attributes
// methods
b2DistanceJointDef.prototype.Initialize = function (bA, bB,
								anchorA, anchorB) {
		this.bodyA = bA;
		this.bodyB = bB;
		this.localAnchorA.SetV( this.bodyA.GetLocalPoint(anchorA));
		this.localAnchorB.SetV( this.bodyB.GetLocalPoint(anchorB));
		var dX = anchorB.x - anchorA.x;
		var dY = anchorB.y - anchorA.y;
		this.length = Math.sqrt(dX*dX + dY*dY);
		this.frequencyHz = 0.0;
		this.dampingRatio = 0.0;
	}
// attributes
b2DistanceJointDef.prototype.localAnchorA =  new b2Vec2();
b2DistanceJointDef.prototype.localAnchorB =  new b2Vec2();
b2DistanceJointDef.prototype.length =  null;
b2DistanceJointDef.prototype.frequencyHz =  null;
b2DistanceJointDef.prototype.dampingRatio =  null;