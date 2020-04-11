var b2ConstantForceController = function() {
b2Controller.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2ConstantForceController.prototype, b2Controller.prototype)
b2ConstantForceController.prototype._super = b2Controller.prototype;
b2ConstantForceController.prototype.__constructor = function(){this._super.__constructor.apply(this, arguments);}
b2ConstantForceController.prototype.__varz = function(){
this.F =  new b2Vec2(0,0);
}
// static methods
// static attributes
// methods
b2ConstantForceController.prototype.Step = function (step) {
		for(var i=m_bodyList;i;i=i.nextBody){
			var body = i.body;
			if(!body.IsAwake())
				continue;
			body.ApplyForce(this.F,body.GetWorldCenter());
		}
	}
// attributes
b2ConstantForceController.prototype.F =  new b2Vec2(0,0);