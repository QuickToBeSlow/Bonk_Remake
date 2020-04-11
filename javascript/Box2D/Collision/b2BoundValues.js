var b2BoundValues = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2BoundValues.prototype.__constructor = function () {
		this.lowerValues = new Array();
		this.lowerValues[0] = 0.0;
		this.lowerValues[1] = 0.0;
		this.upperValues = new Array();
		this.upperValues[0] = 0.0;
		this.upperValues[1] = 0.0;
	}
b2BoundValues.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
// attributes
b2BoundValues.prototype.lowerValues =  null;
b2BoundValues.prototype.upperValues =  null;