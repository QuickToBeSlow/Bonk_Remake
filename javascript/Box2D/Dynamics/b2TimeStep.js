var b2TimeStep = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2TimeStep.prototype.__constructor = function(){}
b2TimeStep.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
b2TimeStep.prototype.Set = function (step) {
		this.dt = step.dt;
		this.inv_dt = step.inv_dt;
		this.positionIterations = step.positionIterations;
		this.velocityIterations = step.velocityIterations;
		this.warmStarting = step.warmStarting;
	}
// attributes
b2TimeStep.prototype.dt =  null;
b2TimeStep.prototype.inv_dt =  null;
b2TimeStep.prototype.dtRatio =  null;
b2TimeStep.prototype.velocityIterations =  0;
b2TimeStep.prototype.positionIterations =  0;
b2TimeStep.prototype.warmStarting =  null;