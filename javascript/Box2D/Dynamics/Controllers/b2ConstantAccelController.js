var b2ConstantAccelController = function() {
b2Controller.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2ConstantAccelController.prototype, b2Controller.prototype)
b2ConstantAccelController.prototype._super = b2Controller.prototype;
b2ConstantAccelController.prototype.__constructor = function(){this._super.__constructor.apply(this, arguments);}
b2ConstantAccelController.prototype.__varz = function(){
this.A =  new b2Vec2(0,0);
}
// static methods
// static attributes
// methods
b2ConstantAccelController.prototype.Step = function (step) {
		var smallA = new b2Vec2(this.A.x*step.dt,this.A.y*step.dt);
		for(var i=m_bodyList;i;i=i.nextBody){
			var body = i.body;
			if(!body.IsAwake())
				continue;
			
			body.SetLinearVelocity(new b2Vec2(
				body.GetLinearVelocity().x +smallA.x,
				body.GetLinearVelocity().y +smallA.y
				));
		}
	}
// attributes
b2ConstantAccelController.prototype.A =  new b2Vec2(0,0);