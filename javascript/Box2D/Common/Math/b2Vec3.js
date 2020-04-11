var b2Vec3 = function(x, y, z) {
	if(arguments.length == 3) {
		this.x=x; this.y=y; this.z=z;
}
}
// static methods
// static attributes
// methods
b2Vec3.prototype.SetZero = function () {
		this.x = this.y = this.z = 0.0;
	}
b2Vec3.prototype.Set = function (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
b2Vec3.prototype.SetV = function (v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}
b2Vec3.prototype.GetNegative = function () { return new b2Vec3( -this.x, -this.y, -this.z); }
b2Vec3.prototype.NegativeSelf = function () { this.x = -this.x; this.y = -this.y; this.z = -this.z; }
b2Vec3.prototype.Copy = function () {
		return new b2Vec3(this.x,this.y,this.z);
	}
b2Vec3.prototype.Add = function (v) {
		this.x += v.x; this.y += v.y; this.z += v.z;
	}
b2Vec3.prototype.Subtract = function (v) {
		this.x -= v.x; this.y -= v.y; this.z -= v.z;
	}
b2Vec3.prototype.Multiply = function (a) {
		this.x *= a; this.y *= a; this.z *= a;
	}
// attributes
b2Vec3.prototype.x =  0;
b2Vec3.prototype.y =  0;
b2Vec3.prototype.z =  0;