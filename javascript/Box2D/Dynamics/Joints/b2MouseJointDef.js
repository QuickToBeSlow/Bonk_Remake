var b2MouseJointDef = function() {
b2JointDef.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2MouseJointDef.prototype, b2JointDef.prototype)
b2MouseJointDef.prototype._super = b2JointDef.prototype;
b2MouseJointDef.prototype.__constructor = function () {
		this._super.__constructor.apply(this, arguments);
		this.type = b2Joint.e_mouseJoint;
		this.maxForce = 0.0;
		this.frequencyHz = 5.0;
		this.dampingRatio = 0.7;
	}
b2MouseJointDef.prototype.__varz = function(){
this.target =  new b2Vec2();
}
// static methods
// static attributes
// methods
// attributes
b2MouseJointDef.prototype.target =  new b2Vec2();
b2MouseJointDef.prototype.maxForce =  null;
b2MouseJointDef.prototype.frequencyHz =  null;
b2MouseJointDef.prototype.dampingRatio =  null;