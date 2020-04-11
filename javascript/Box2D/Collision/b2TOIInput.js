var b2TOIInput = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2TOIInput.prototype.__constructor = function(){}
b2TOIInput.prototype.__varz = function(){
this.proxyA =  new b2DistanceProxy();
this.proxyB =  new b2DistanceProxy();
this.sweepA =  new b2Sweep();
this.sweepB =  new b2Sweep();
}
// static methods
// static attributes
// methods
// attributes
b2TOIInput.prototype.proxyA =  new b2DistanceProxy();
b2TOIInput.prototype.proxyB =  new b2DistanceProxy();
b2TOIInput.prototype.sweepA =  new b2Sweep();
b2TOIInput.prototype.sweepB =  new b2Sweep();
b2TOIInput.prototype.tolerance =  null;