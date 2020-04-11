var b2Shape = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Shape.prototype.__constructor = function () {
		this.m_type = b2Shape.e_unknownShape;
		this.m_radius = b2Settings.b2_linearSlop;
	}
b2Shape.prototype.__varz = function(){
}
// static methods
b2Shape.TestOverlap = function (shape1, transform1, shape2, transform2) {
		var input = new b2DistanceInput();
		input.proxyA = new b2DistanceProxy();
		input.proxyA.Set(shape1);
		input.proxyB = new b2DistanceProxy();
		input.proxyB.Set(shape2);
		input.transformA = transform1;
		input.transformB = transform2;
		input.useRadii = true;
		var simplexCache = new b2SimplexCache();
		simplexCache.count = 0;
		var output = new b2DistanceOutput();
		b2Distance.Distance(output, simplexCache, input);
		return output.distance < 10.0 * Number.MIN_VALUE;
	}
// static attributes
b2Shape.e_hitCollide =  1;
b2Shape.e_missCollide =  0;
b2Shape.e_startsInsideCollide =  -1;
b2Shape.e_unknownShape =  	-1;
b2Shape.e_circleShape =  	0;
b2Shape.e_polygonShape =  	1;
b2Shape.e_edgeShape =  2;
b2Shape.e_shapeTypeCount =  	3;
// methods
b2Shape.prototype.Copy = function () {
		
		
		
		return null; 
	}
b2Shape.prototype.Set = function (other) {
		
		
		this.m_radius = other.m_radius;
	}
b2Shape.prototype.GetType = function () {
		return this.m_type;
	}
b2Shape.prototype.TestPoint = function (xf, p) {return false}
b2Shape.prototype.RayCast = function (output, input, transform) {
		return false;
	}
b2Shape.prototype.ComputeAABB = function (aabb, xf) {}
b2Shape.prototype.ComputeMass = function (massData, density) { }
b2Shape.prototype.ComputeSubmergedArea = function (
				normal,
				offset,
				xf,
				c) { return 0; }
// attributes
b2Shape.prototype.m_type =  0;
b2Shape.prototype.m_radius =  null;