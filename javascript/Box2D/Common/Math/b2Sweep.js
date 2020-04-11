var b2Sweep = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Sweep.prototype.__constructor = function(){}
b2Sweep.prototype.__varz = function(){
this.localCenter =  new b2Vec2();
this.c0 =  new b2Vec2;
this.c =  new b2Vec2();
}
// static methods
// static attributes
// methods
b2Sweep.prototype.Set = function (other) {
		this.localCenter.SetV(other.localCenter);
		this.c0.SetV(other.c0);
		this.c.SetV(other.c);
		this.a0 = other.a0;
		this.a = other.a;
		this.t0 = other.t0;
	}
b2Sweep.prototype.Copy = function () {
		var copy = new b2Sweep();
		copy.localCenter.SetV(this.localCenter);
		copy.c0.SetV(this.c0);
		copy.c.SetV(this.c);
		copy.a0 = this.a0;
		copy.a = this.a;
		copy.t0 = this.t0;
		return copy;
	}
b2Sweep.prototype.GetTransform = function (xf, alpha) {
		xf.position.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
		xf.position.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
		var angle = (1.0 - alpha) * this.a0 + alpha * this.a;
		xf.R.Set(angle);
		
		
		
		var tMat = xf.R;
		xf.position.x -= (tMat.col1.x * this.localCenter.x + tMat.col2.x * this.localCenter.y);
		xf.position.y -= (tMat.col1.y * this.localCenter.x + tMat.col2.y * this.localCenter.y);
	}
b2Sweep.prototype.Advance = function (t) {
		if (this.t0 < t && 1.0 - this.t0 > Number.MIN_VALUE)
		{
			var alpha = (t - this.t0) / (1.0 - this.t0);
			
			this.c0.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
			this.c0.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
			this.a0 = (1.0 - alpha) * this.a0 + alpha * this.a;
			this.t0 = t;
		}
	}
// attributes
b2Sweep.prototype.localCenter =  new b2Vec2();
b2Sweep.prototype.c0 =  new b2Vec2;
b2Sweep.prototype.c =  new b2Vec2();
b2Sweep.prototype.a0 =  null;
b2Sweep.prototype.a =  null;
b2Sweep.prototype.t0 =  null;