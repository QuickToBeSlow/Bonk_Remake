var b2DistanceProxy = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2DistanceProxy.prototype.__constructor = function(){}
b2DistanceProxy.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
b2DistanceProxy.prototype.Set = function (shape) {
			switch(shape.GetType())
			{
				case b2Shape.e_circleShape:
				{
					var circle = shape;
					this.m_vertices = new Array(1);
					this.m_vertices[0] = circle.m_p;
					this.m_count = 1;
					this.m_radius = circle.m_radius;
				}
				break;
				case b2Shape.e_polygonShape:
				{
					var polygon = shape;
					this.m_vertices = polygon.m_vertices;
					this.m_count = polygon.m_vertexCount;
					this.m_radius = polygon.m_radius;
				}
				break;
				default:
				b2Settings.b2Assert(false);
			}
		}
b2DistanceProxy.prototype.GetSupport = function (d) {
			var bestIndex = 0;
			var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
			for (var i= 1; i < this.m_count; ++i)
			{
				var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
				if (value > bestValue)
				{
					bestIndex = i;
					bestValue = value;
				}
			}
			return bestIndex;
		}
b2DistanceProxy.prototype.GetSupportVertex = function (d) {
			var bestIndex = 0;
			var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
			for (var i= 1; i < this.m_count; ++i)
			{
				var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
				if (value > bestValue)
				{
					bestIndex = i;
					bestValue = value;
				}
			}
			return this.m_vertices[bestIndex];
		}
b2DistanceProxy.prototype.GetVertexCount = function () {
			return this.m_count;
		}
b2DistanceProxy.prototype.GetVertex = function (index) {
			b2Settings.b2Assert(0 <= index && index < this.m_count);
			return this.m_vertices[index];
		}
// attributes
b2DistanceProxy.prototype.m_vertices =  null;
b2DistanceProxy.prototype.m_count =  0;
b2DistanceProxy.prototype.m_radius =  null;