var b2TensorDampingController = function() {
b2Controller.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2TensorDampingController.prototype, b2Controller.prototype)
b2TensorDampingController.prototype._super = b2Controller.prototype;
b2TensorDampingController.prototype.__constructor = function(){this._super.__constructor.apply(this, arguments);}
b2TensorDampingController.prototype.__varz = function(){
this.T =  new b2Mat22();
}
// static methods
// static attributes
// methods
b2TensorDampingController.prototype.SetAxisAligned = function (xDamping, yDamping) {
		this.T.col1.x = -xDamping;
		this.T.col1.y = 0;
		this.T.col2.x = 0;
		this.T.col2.y = -yDamping;
		if(xDamping>0 || yDamping>0){
			this.maxTimestep = 1/Math.max(xDamping,yDamping);
		}else{
			this.maxTimestep = 0;
		}
	}
b2TensorDampingController.prototype.Step = function (step) {
		var timestep = step.dt;
		if(timestep<=Number.MIN_VALUE)
			return;
		if(timestep>this.maxTimestep && this.maxTimestep>0)
			timestep = this.maxTimestep;
		for(var i=m_bodyList;i;i=i.nextBody){
			var body = i.body;
			if(!body.IsAwake()){
				
				continue;
			}
			var damping =
				body.GetWorldVector(
					b2Math.MulMV(this.T,
						body.GetLocalVector(
							body.GetLinearVelocity()
						)
					)
				);
			body.SetLinearVelocity(new b2Vec2(
				body.GetLinearVelocity().x + damping.x * timestep,
				body.GetLinearVelocity().y + damping.y * timestep
				));
		}
	}
// attributes
b2TensorDampingController.prototype.T =  new b2Mat22();
b2TensorDampingController.prototype.maxTimestep =  0;