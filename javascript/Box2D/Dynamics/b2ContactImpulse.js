var b2ContactImpulse = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2ContactImpulse.prototype.__constructor = function(){}
b2ContactImpulse.prototype.__varz = function(){
this.normalImpulses =  new Array(b2Settings.b2_maxManifoldPoints);
this.tangentImpulses =  new Array(b2Settings.b2_maxManifoldPoints);
}
// static methods
// static attributes
// methods
// attributes
b2ContactImpulse.prototype.normalImpulses =  new Array(b2Settings.b2_maxManifoldPoints);
b2ContactImpulse.prototype.tangentImpulses =  new Array(b2Settings.b2_maxManifoldPoints);