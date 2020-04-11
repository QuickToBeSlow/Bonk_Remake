var b2Bound = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Bound.prototype.__constructor = function(){}
b2Bound.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
b2Bound.prototype.IsLower = function () { return (this.value & 1) == 0; }
b2Bound.prototype.IsUpper = function () { return (this.value & 1) == 1; }
b2Bound.prototype.Swap = function (b) {
		var tempValue = this.value;
		var tempProxy = this.proxy;
		var tempStabbingCount = this.stabbingCount;
		
		this.value = b.value;
		this.proxy = b.proxy;
		this.stabbingCount = b.stabbingCount;
		
		b.value = tempValue;
		b.proxy = tempProxy;
		b.stabbingCount = tempStabbingCount;
	}
// attributes
b2Bound.prototype.value =  0;
b2Bound.prototype.proxy =  null;
b2Bound.prototype.stabbingCount =  0;