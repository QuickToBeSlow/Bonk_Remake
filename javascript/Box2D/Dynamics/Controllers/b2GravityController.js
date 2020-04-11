var b2GravityController = function() {
b2Controller.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2GravityController.prototype, b2Controller.prototype)
b2GravityController.prototype._super = b2Controller.prototype;
b2GravityController.prototype.__constructor = function(){this._super.__constructor.apply(this, arguments);}
b2GravityController.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
b2GravityController.prototype.Step = function (step) {
		
		var i = null;
		var body1 = null;
		var p1 = null;
		var mass1 = 0;
		var j = null;
		var body2 = null;
		var p2 = null;
		var dx = 0;
		var dy = 0;
		var r2 = 0;
		var f = null;
		if(this.invSqr){
			for(i=m_bodyList;i;i=i.nextBody){
				body1 = i.body;
				p1 = body1.GetWorldCenter();
				mass1 = body1.GetMass();
				for(j=m_bodyList;j!=i;j=j.nextBody){
					body2 = j.body;
					p2 = body2.GetWorldCenter()
					dx = p2.x - p1.x;
					dy = p2.y - p1.y;
					r2 = dx*dx+dy*dy;
					if(r2<Number.MIN_VALUE)
						continue;
					f = new b2Vec2(dx,dy);
					f.Multiply(this.G / r2 / Math.sqrt(r2) * mass1* body2.GetMass());
					if(body1.IsAwake())
						body1.ApplyForce(f,p1);
					f.Multiply(-1);
					if(body2.IsAwake())
						body2.ApplyForce(f,p2);
				}
			}
		}else{
			for(i=m_bodyList;i;i=i.nextBody){
				body1 = i.body;
				p1 = body1.GetWorldCenter();
				mass1 = body1.GetMass();
				for(j=m_bodyList;j!=i;j=j.nextBody){
					body2 = j.body;
					p2 = body2.GetWorldCenter()
					dx = p2.x - p1.x;
					dy = p2.y - p1.y;
					r2 = dx*dx+dy*dy;
					if(r2<Number.MIN_VALUE)
						continue;
					f = new b2Vec2(dx,dy);
					f.Multiply(this.G / r2 * mass1 * body2.GetMass());
					if(body1.IsAwake())
						body1.ApplyForce(f,p1);
					f.Multiply(-1);
					if(body2.IsAwake())
						body2.ApplyForce(f,p2);
				}
			}
		}
	}
// attributes
b2GravityController.prototype.G =  1;
b2GravityController.prototype.invSqr =  true;