var b2ContactConstraint = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2ContactConstraint.prototype.__constructor = function () {
		this.points = new Array(b2Settings.b2_maxManifoldPoints);
		for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++){
			this.points[i] = new b2ContactConstraintPoint();
		}
		
		
	}
b2ContactConstraint.prototype.__varz = function(){
this.localPlaneNormal =  new b2Vec2();
this.localPoint =  new b2Vec2();
this.normal =  new b2Vec2();
this.normalMass =  new b2Mat22();
this.K =  new b2Mat22();
}
// static methods
// static attributes
// methods
// attributes
b2ContactConstraint.prototype.points =  null;
b2ContactConstraint.prototype.localPlaneNormal =  new b2Vec2();
b2ContactConstraint.prototype.localPoint =  new b2Vec2();
b2ContactConstraint.prototype.normal =  new b2Vec2();
b2ContactConstraint.prototype.normalMass =  new b2Mat22();
b2ContactConstraint.prototype.K =  new b2Mat22();
b2ContactConstraint.prototype.bodyA =  null;
b2ContactConstraint.prototype.bodyB =  null;
b2ContactConstraint.prototype.type =  0;
b2ContactConstraint.prototype.radius =  null;
b2ContactConstraint.prototype.friction =  null;
b2ContactConstraint.prototype.restitution =  null;
b2ContactConstraint.prototype.pointCount =  0;
b2ContactConstraint.prototype.manifold =  null;