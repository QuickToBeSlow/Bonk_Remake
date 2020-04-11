var b2Color = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Color.prototype.__constructor = function (rr, gg, bb) {
		this._r = parseInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
		this._g = parseInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
		this._b = parseInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
	}
b2Color.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
b2Color.prototype.Set = function (rr, gg, bb) {
		this._r = parseInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
		this._g = parseInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
		this._b = parseInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
	}
	
b2Color.prototype.__defineGetter__("r", function() {
			return this._r;
		});
b2Color.prototype.__defineSetter__("r", function(rr) {
		this._r = parseInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
	});
b2Color.prototype.__defineGetter__("g", function() {
				return this._g;
			});
b2Color.prototype.__defineSetter__("g", function(gg) {
		this._g = parseInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
	});
b2Color.prototype.__defineGetter__("b", function() {
					return this._b;
				});
b2Color.prototype.__defineSetter__("b", function(bb) {
		this._b = parseInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
	});
b2Color.prototype.__defineGetter__("color", function() {
		return (this._r << 16) | (this._g << 8) | (this._b);
	});
// attributes
b2Color.prototype._r =  0;
b2Color.prototype._g =  0;
b2Color.prototype._b =  0;