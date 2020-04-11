var b2NullContact = function() {
b2Contact.prototype.__varz.call(this)
this.__varz();
this.__constructor.apply(this, arguments);
}
extend(b2NullContact.prototype, b2Contact.prototype)
b2NullContact.prototype._super = b2Contact.prototype;
b2NullContact.prototype.__constructor = function () {this._super.__constructor.apply(this, arguments);}
b2NullContact.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
b2NullContact.prototype.Evaluate = function () {}
// attributes