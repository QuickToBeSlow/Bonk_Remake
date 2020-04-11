var b2SimplexCache = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2SimplexCache.prototype.__constructor = function(){}
b2SimplexCache.prototype.__varz = function(){
this.indexA =  new Array(3);
this.indexB =  new Array(3);
}
// static methods
// static attributes
// methods
// attributes
b2SimplexCache.prototype.metric =  null;
b2SimplexCache.prototype.count =  0;
b2SimplexCache.prototype.indexA =  new Array(3);
b2SimplexCache.prototype.indexB =  new Array(3);