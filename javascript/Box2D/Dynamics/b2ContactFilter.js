var b2ContactFilter = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2ContactFilter.prototype.__constructor = function(){}
b2ContactFilter.prototype.__varz = function(){
}
// static methods
// static attributes
b2ContactFilter.b2_defaultFilter =  new b2ContactFilter();
// methods
b2ContactFilter.prototype.ShouldCollide = function (fixtureA, fixtureB) {
		var filter1 = fixtureA.GetFilterData();
		var filter2 = fixtureB.GetFilterData();
		
		if (filter1.groupIndex == filter2.groupIndex && filter1.groupIndex != 0)
		{
			return filter1.groupIndex > 0;
		}
		
		var collide = (filter1.maskBits & filter2.categoryBits) != 0 && (filter1.categoryBits & filter2.maskBits) != 0;
		return collide;
	}
b2ContactFilter.prototype.RayCollide = function (userData, fixture) {
		if(!userData)
			return true;
		return this.ShouldCollide(userData,fixture);
	}
// attributes