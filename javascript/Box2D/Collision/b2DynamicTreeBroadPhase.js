var b2DynamicTreeBroadPhase = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2DynamicTreeBroadPhase.prototype.__constructor = function(){}
b2DynamicTreeBroadPhase.prototype.__varz = function(){
this.m_tree =  new b2DynamicTree();
this.m_moveBuffer =  new Array();
this.m_pairBuffer =  new Array();
}
// static methods
// static attributes
// methods
b2DynamicTreeBroadPhase.prototype.BufferMove = function (proxy) {
		this.m_moveBuffer[this.m_moveBuffer.length] = proxy;
	}
b2DynamicTreeBroadPhase.prototype.UnBufferMove = function (proxy) {
		var i = this.m_moveBuffer.indexOf(proxy);
		this.m_moveBuffer.splice(i, 1);
	}
b2DynamicTreeBroadPhase.prototype.ComparePairs = function (pair1, pair2) {
		
		
		
		return 0;
	}
b2DynamicTreeBroadPhase.prototype.CreateProxy = function (aabb, userData) {
		var proxy = this.m_tree.CreateProxy(aabb, userData);
		++this.m_proxyCount;
		this.BufferMove(proxy);
		return proxy;
	}
b2DynamicTreeBroadPhase.prototype.DestroyProxy = function (proxy) {
		this.UnBufferMove(proxy);
		--this.m_proxyCount;
		this.m_tree.DestroyProxy(proxy);
	}
b2DynamicTreeBroadPhase.prototype.MoveProxy = function (proxy, aabb, displacement) {
		var buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
		if (buffer)
		{
			this.BufferMove(proxy);
		}
	}
b2DynamicTreeBroadPhase.prototype.TestOverlap = function (proxyA, proxyB) {
		var aabbA = this.m_tree.GetFatAABB(proxyA);
		var aabbB = this.m_tree.GetFatAABB(proxyB);
		return aabbA.TestOverlap(aabbB);
	}
b2DynamicTreeBroadPhase.prototype.GetUserData = function (proxy) {
		return this.m_tree.GetUserData(proxy);
	}
b2DynamicTreeBroadPhase.prototype.GetFatAABB = function (proxy) {
		return this.m_tree.GetFatAABB(proxy);
	}
b2DynamicTreeBroadPhase.prototype.GetProxyCount = function () {
		return this.m_proxyCount;
	}
b2DynamicTreeBroadPhase.prototype.UpdatePairs = function (callback) {
		this.m_pairCount = 0;
		
		for(var i=0, queryProxy=null;i<this.m_moveBuffer.length, queryProxy=this.m_moveBuffer[i]; i++)
		{
			var that = this;
			function QueryCallback(proxy)
			{
				
				if (proxy == queryProxy)
					return true;
					
				
				if (that.m_pairCount == that.m_pairBuffer.length)
				{
					that.m_pairBuffer[that.m_pairCount] = new b2DynamicTreePair();
				}
				
				var pair = that.m_pairBuffer[that.m_pairCount];
				pair.proxyA = proxy < queryProxy?proxy:queryProxy;
				pair.proxyB = proxy >= queryProxy?proxy:queryProxy;
				++that.m_pairCount;
				
				return true;
			}
			
			
			var fatAABB = this.m_tree.GetFatAABB(queryProxy);
			this.m_tree.Query(QueryCallback, fatAABB);
		}
		
		
		this.m_moveBuffer.length = 0;
		
		
		
		
		
		
		for (var i = 0; i < this.m_pairCount; )
		{
			var primaryPair = this.m_pairBuffer[i];
			var userDataA = this.m_tree.GetUserData(primaryPair.proxyA);
			var userDataB = this.m_tree.GetUserData(primaryPair.proxyB);
			callback(userDataA, userDataB);
			++i;
			
			
			while (i < this.m_pairCount)
			{
				var pair = this.m_pairBuffer[i];
				if (pair.proxyA != primaryPair.proxyA || pair.proxyB != primaryPair.proxyB)
				{
					break;
				}
				++i;
			}
		}
	}
b2DynamicTreeBroadPhase.prototype.Query = function (callback, aabb) {
		this.m_tree.Query(callback, aabb);
	}
b2DynamicTreeBroadPhase.prototype.RayCast = function (callback, input) {
		this.m_tree.RayCast(callback, input);
	}
b2DynamicTreeBroadPhase.prototype.Validate = function () {
		
	}
b2DynamicTreeBroadPhase.prototype.Rebalance = function (iterations) {
		this.m_tree.Rebalance(iterations);
	}
// attributes
b2DynamicTreeBroadPhase.prototype.m_tree =  new b2DynamicTree();
b2DynamicTreeBroadPhase.prototype.m_proxyCount =  0;
b2DynamicTreeBroadPhase.prototype.m_moveBuffer =  new Array();
b2DynamicTreeBroadPhase.prototype.m_pairBuffer =  new Array();
b2DynamicTreeBroadPhase.prototype.m_pairCount =  0;