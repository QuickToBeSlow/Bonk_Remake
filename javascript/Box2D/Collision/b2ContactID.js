var b2ContactID = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2ContactID.prototype.__constructor = function () {
		this.features._m_id = this;
		
	}
b2ContactID.prototype.__varz = function(){
this.features =  new Features();
}
// static methods
// static attributes
// methods
b2ContactID.prototype.Set = function (id) {
		key = id._key;
	}
b2ContactID.prototype.Copy = function () {
		var id = new b2ContactID();
		id.key = key;
		return id;
	}
b2ContactID.prototype.__defineSetter__("key", function () {
		return this._key;
    });
b2ContactID.prototype.__defineSetter__("key", function(value) { 
		this._key = value;
		this.features._referenceEdge = this._key & 0x000000ff;
		this.features._incidentEdge = ((this._key & 0x0000ff00) >> 8) & 0x000000ff;
		this.features._incidentVertex = ((this._key & 0x00ff0000) >> 16) & 0x000000ff;
		this.features._flip = ((this._key & 0xff000000) >> 24) & 0x000000ff;
    });
// attributes
b2ContactID.prototype._key =  0;
b2ContactID.prototype.features =  new Features();