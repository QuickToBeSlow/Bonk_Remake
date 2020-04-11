var Features = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
Features.prototype.__constructor = function(){}
Features.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
Features.prototype.__defineGetter__("referenceEdge", function() {
		return this._referenceEdge;
    });   
Features.prototype.__defineSetter__("referenceEdge", function(value) {
		this._referenceEdge = value;
		this._m_id._key = (this._m_id._key & 0xffffff00) | (this._referenceEdge & 0x000000ff);
    });
Features.prototype.__defineGetter__("incidentEdge", function() {
		return this._incidentEdge;
    });
Features.prototype.__defineSetter__("incidentEdge", function(value) {
		this._incidentEdge = value;
		this._m_id._key = (this._m_id._key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00);
    });
Features.prototype.__defineGetter__("incidentVertex", function() {
		return this._incidentVertex;
    });
Features.prototype.__defineSetter__("incidentVertex", function(value) {
		this._incidentVertex = value;
		this._m_id._key = (this._m_id._key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000);
    });
Features.prototype.__defineGetter__("flip", function() {
		return this._flip;
    });
Features.prototype.__defineSetter__("flip", function(value) {
		this._flip = value;
		this._m_id._key = (this._m_id._key & 0x00ffffff) | ((this._flip << 24) & 0xff000000);
    });
// attributes
Features.prototype._referenceEdge =  0;
Features.prototype._incidentEdge =  0;
Features.prototype._incidentVertex =  0;
Features.prototype._flip =  0;
Features.prototype._m_id =  null;    