var b2DynamicTreeNode = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2DynamicTreeNode.prototype.__constructor = function(){}
b2DynamicTreeNode.prototype.__varz = function(){
this.aabb =  new b2AABB();
}
// static methods
// static attributes
// methods
b2DynamicTreeNode.prototype.IsLeaf = function () {
			return this.child1 == null;
		}
// attributes
b2DynamicTreeNode.prototype.userData =  null;
b2DynamicTreeNode.prototype.aabb =  new b2AABB();
b2DynamicTreeNode.prototype.parent =  null;
b2DynamicTreeNode.prototype.child1 =  null;
b2DynamicTreeNode.prototype.child2 =  null;