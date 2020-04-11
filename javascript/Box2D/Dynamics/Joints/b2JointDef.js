var b2JointDef = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2JointDef.prototype.__constructor = function () {
		this.type = b2Joint.e_unknownJoint;
		this.userData = null;
		this.bodyA = null;
		this.bodyB = null;
		this.collideConnected = false;
	}
b2JointDef.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
// attributes
b2JointDef.prototype.type =  0;
b2JointDef.prototype.userData =  null;
b2JointDef.prototype.bodyA =  null;
b2JointDef.prototype.bodyB =  null;
b2JointDef.prototype.collideConnected =  null;