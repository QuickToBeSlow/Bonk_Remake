var b2Transform = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Transform.prototype.__constructor = function (pos, r) {
		if (pos){
			this.position.SetV(pos);
			this.R.SetM(r);

		}
	}
b2Transform.prototype.__varz = function(){
this.position =  new b2Vec2;
this.R =  new b2Mat22();
}
// static methods
// static attributes
// methods
b2Transform.prototype.Initialize = function (pos, r) {
		this.position.SetV(pos);
		this.R.SetM(r);
	}
b2Transform.prototype.SetIdentity = function () {
		this.position.SetZero();
		this.R.SetIdentity();
	}
b2Transform.prototype.Set = function (x) {

		this.position.SetV(x.position);

		this.R.SetM(x.R);

	}
b2Transform.prototype.GetAngle = function () {
		return Math.atan2(this.R.col1.y, this.R.col1.x);
	}
// attributes
b2Transform.prototype.position =  new b2Vec2;
b2Transform.prototype.R =  new b2Mat22();