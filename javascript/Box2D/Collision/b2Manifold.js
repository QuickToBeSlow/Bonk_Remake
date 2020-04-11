var b2Manifold = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Manifold.prototype.__constructor = function () {
		this.m_points = new Array(b2Settings.b2_maxManifoldPoints);
		for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++){
			this.m_points[i] = new b2ManifoldPoint();
		}
		this.m_localPlaneNormal = new b2Vec2();
		this.m_localPoint = new b2Vec2();
	}
b2Manifold.prototype.__varz = function(){
}
// static methods
// static attributes
b2Manifold.e_circles =  0x0001;
b2Manifold.e_faceA =  0x0002;
b2Manifold.e_faceB =  0x0004;
// methods
b2Manifold.prototype.Reset = function () {
		for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++){
			(this.m_points[i]).Reset();
		}
		this.m_localPlaneNormal.SetZero();
		this.m_localPoint.SetZero();
		this.m_type = 0;
		this.m_pointCount = 0;
	}
b2Manifold.prototype.Set = function (m) {
		this.m_pointCount = m.m_pointCount;
		for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++){
			(this.m_points[i]).Set(m.m_points[i]);
		}
		this.m_localPlaneNormal.SetV(m.m_localPlaneNormal);
		this.m_localPoint.SetV(m.m_localPoint);
		this.m_type = m.m_type;
	}
b2Manifold.prototype.Copy = function () {
		var copy = new b2Manifold();
		copy.Set(this);
		return copy;
	}
// attributes
b2Manifold.prototype.m_points =  null;
b2Manifold.prototype.m_localPlaneNormal =  null;
b2Manifold.prototype.m_localPoint =  null;
b2Manifold.prototype.m_type =  0;
b2Manifold.prototype.m_pointCount =  0;