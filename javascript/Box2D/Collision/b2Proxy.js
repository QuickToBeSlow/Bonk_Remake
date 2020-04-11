var b2Proxy = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Proxy.prototype.__constructor = function(){}
b2Proxy.prototype.__varz = function(){
this.lowerBounds =  new Array(2);
this.upperBounds =  new Array(2);
this.pairs =  new Object();
}
// static methods
// static attributes
// methods
b2Proxy.prototype.IsValid = function () { return this.overlapCount != b2BroadPhase.b2_invalid; }
// attributes
b2Proxy.prototype.lowerBounds =  new Array(2);
b2Proxy.prototype.upperBounds =  new Array(2);
b2Proxy.prototype.overlapCount =  0;
b2Proxy.prototype.timeStamp =  0;
b2Proxy.prototype.pairs =  new Object();
b2Proxy.prototype.next =  null;
b2Proxy.prototype.userData =  null;