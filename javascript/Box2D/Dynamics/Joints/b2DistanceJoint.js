var b2DistanceJoint = function() {
b2Joint.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2DistanceJoint.prototype, b2Joint.prototype)
b2DistanceJoint.prototype._super = b2Joint.prototype;
b2DistanceJoint.prototype.__constructor = function (def) {
		this._super.__constructor.apply(this, [def]);
		
		var tMat;
		var tX;
		var tY;
		this.m_localAnchor1.SetV(def.localAnchorA);
		this.m_localAnchor2.SetV(def.localAnchorB);
		
		this.m_length = def.length;
		this.m_frequencyHz = def.frequencyHz;
		this.m_dampingRatio = def.dampingRatio;
		this.m_impulse = 0.0;
		this.m_gamma = 0.0;
		this.m_bias = 0.0;
	}
b2DistanceJoint.prototype.__varz = function(){
this.m_localAnchor1 =  new b2Vec2();
this.m_localAnchor2 =  new b2Vec2();
this.m_u =  new b2Vec2();
}
// static methods
// static attributes
// methods
b2DistanceJoint.prototype.InitVelocityConstraints = function (step) {
		
		var tMat;
		var tX;
		
		var bA = this.m_bodyA;
		var bB = this.m_bodyB;
		
		
		
		tMat = bA.m_xf.R;
		var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
		r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
		r1X = tX;
		
		tMat = bB.m_xf.R;
		var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
		r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
		r2X = tX;
		
		
		this.m_u.x = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
		this.m_u.y = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
		
		
		
		var length = Math.sqrt(this.m_u.x*this.m_u.x + this.m_u.y*this.m_u.y);
		if (length > b2Settings.b2_linearSlop)
		{
			
			this.m_u.Multiply( 1.0 / length );
		}
		else
		{
			this.m_u.SetZero();
		}
		
		
		var cr1u = (r1X * this.m_u.y - r1Y * this.m_u.x);
		
		var cr2u = (r2X * this.m_u.y - r2Y * this.m_u.x);
		
		var invMass = bA.m_invMass + bA.m_invI * cr1u * cr1u + bB.m_invMass + bB.m_invI * cr2u * cr2u;
		this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;
		
		if (this.m_frequencyHz > 0.0)
		{
			var C = length - this.m_length;
	
			
			var omega = 2.0 * Math.PI * this.m_frequencyHz;
	
			
			var d = 2.0 * this.m_mass * this.m_dampingRatio * omega;
	
			
			var k = this.m_mass * omega * omega;
	
			
			this.m_gamma = step.dt * (d + step.dt * k);
			this.m_gamma = this.m_gamma != 0.0?1 / this.m_gamma:0.0;
			this.m_bias = C * step.dt * k * this.m_gamma;
	
			this.m_mass = invMass + this.m_gamma;
			this.m_mass = this.m_mass != 0.0 ? 1.0 / this.m_mass : 0.0;
		}
		
		if (step.warmStarting)
		{
			
			this.m_impulse *= step.dtRatio;
			
			
			var PX = this.m_impulse * this.m_u.x;
			var PY = this.m_impulse * this.m_u.y;
			
			bA.m_linearVelocity.x -= bA.m_invMass * PX;
			bA.m_linearVelocity.y -= bA.m_invMass * PY;
			
			bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
			
			bB.m_linearVelocity.x += bB.m_invMass * PX;
			bB.m_linearVelocity.y += bB.m_invMass * PY;
			
			bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
		}
		else
		{
			this.m_impulse = 0.0;
		}
	}
b2DistanceJoint.prototype.SolveVelocityConstraints = function (step) {
		
		var tMat;
		
		var bA = this.m_bodyA;
		var bB = this.m_bodyB;
		
		
		tMat = bA.m_xf.R;
		var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
		r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
		r1X = tX;
		
		tMat = bB.m_xf.R;
		var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
		r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
		r2X = tX;
		
		
		
		var v1X = bA.m_linearVelocity.x + (-bA.m_angularVelocity * r1Y);
		var v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
		
		var v2X = bB.m_linearVelocity.x + (-bB.m_angularVelocity * r2Y);
		var v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
		
		var Cdot = (this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y));
		
		var impulse = -this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse);
		this.m_impulse += impulse;
		
		
		var PX = impulse * this.m_u.x;
		var PY = impulse * this.m_u.y;
		
		bA.m_linearVelocity.x -= bA.m_invMass * PX;
		bA.m_linearVelocity.y -= bA.m_invMass * PY;
		
		bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
		
		bB.m_linearVelocity.x += bB.m_invMass * PX;
		bB.m_linearVelocity.y += bB.m_invMass * PY;
		
		bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
	}
b2DistanceJoint.prototype.SolvePositionConstraints = function (baumgarte) {
		
		
		var tMat;
		
		if (this.m_frequencyHz > 0.0)
		{
			
			return true;
		}
		
		var bA = this.m_bodyA;
		var bB = this.m_bodyB;
		
		
		tMat = bA.m_xf.R;
		var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
		r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
		r1X = tX;
		
		tMat = bB.m_xf.R;
		var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
		r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
		r2X = tX;
		
		
		var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
		var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
		
		
		var length = Math.sqrt(dX*dX + dY*dY);
		dX /= length;
		dY /= length;
		
		var C = length - this.m_length;
		C = b2Math.Clamp(C, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
		
		var impulse = -this.m_mass * C;
		
		this.m_u.Set(dX, dY);
		
		var PX = impulse * this.m_u.x;
		var PY = impulse * this.m_u.y;
		
		
		bA.m_sweep.c.x -= bA.m_invMass * PX;
		bA.m_sweep.c.y -= bA.m_invMass * PY;
		
		bA.m_sweep.a -= bA.m_invI * (r1X * PY - r1Y * PX);
		
		bB.m_sweep.c.x += bB.m_invMass * PX;
		bB.m_sweep.c.y += bB.m_invMass * PY;
		
		bB.m_sweep.a += bB.m_invI * (r2X * PY - r2Y * PX);
		
		bA.SynchronizeTransform();
		bB.SynchronizeTransform();
		
		return b2Math.Abs(C) < b2Settings.b2_linearSlop;
		
	}
b2DistanceJoint.prototype.GetAnchorA = function () {
		return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
	}
b2DistanceJoint.prototype.GetAnchorB = function () {
		return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
	}
b2DistanceJoint.prototype.GetReactionForce = function (inv_dt) {
		
		
		return new b2Vec2(inv_dt * this.m_impulse * this.m_u.x, inv_dt * this.m_impulse * this.m_u.y);
	}
b2DistanceJoint.prototype.GetReactionTorque = function (inv_dt) {
		
		return 0.0;
	}
b2DistanceJoint.prototype.GetLength = function () {
		return this.m_length;
	}
b2DistanceJoint.prototype.SetLength = function (length) {
		this.m_length = length;
	}
b2DistanceJoint.prototype.GetFrequency = function () {
		return this.m_frequencyHz;
	}
b2DistanceJoint.prototype.SetFrequency = function (hz) {
		this.m_frequencyHz = hz;
	}
b2DistanceJoint.prototype.GetDampingRatio = function () {
		return this.m_dampingRatio;
	}
b2DistanceJoint.prototype.SetDampingRatio = function (ratio) {
		this.m_dampingRatio = ratio;
	}
// attributes
b2DistanceJoint.prototype.m_localAnchor1 =  new b2Vec2();
b2DistanceJoint.prototype.m_localAnchor2 =  new b2Vec2();
b2DistanceJoint.prototype.m_u =  new b2Vec2();
b2DistanceJoint.prototype.m_frequencyHz =  null;
b2DistanceJoint.prototype.m_dampingRatio =  null;
b2DistanceJoint.prototype.m_gamma =  null;
b2DistanceJoint.prototype.m_bias =  null;
b2DistanceJoint.prototype.m_impulse =  null;
b2DistanceJoint.prototype.m_mass =  null;
b2DistanceJoint.prototype.m_length =  null;