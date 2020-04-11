var b2BroadPhase = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2BroadPhase.prototype.__constructor = function (worldAABB) {
		
		var i = 0;
		
		this.m_pairManager.Initialize(this);
		
		this.m_worldAABB = worldAABB;
		
		this.m_proxyCount = 0;
		
		
		this.m_bounds = new Array();
		for (i = 0; i < 2; i++){
			this.m_bounds[i] = new Array();
		}
		
		
		var dX = worldAABB.upperBound.x - worldAABB.lowerBound.x;;
		var dY = worldAABB.upperBound.y - worldAABB.lowerBound.y;
		
		this.m_quantizationFactor.x = b2Settings.USHRT_MAX / dX;
		this.m_quantizationFactor.y = b2Settings.USHRT_MAX / dY;
		
		this.m_timeStamp = 1;
		this.m_queryResultCount = 0;
	}
b2BroadPhase.prototype.__varz = function(){
this.m_pairManager =  new b2PairManager();
this.m_proxyPool =  new Array();
this.m_querySortKeys =  new Array();
this.m_queryResults =  new Array();
this.m_quantizationFactor =  new b2Vec2();
}
// static methods
b2BroadPhase.BinarySearch = function (bounds, count, value) {
		var low = 0;
		var high = count - 1;
		while (low <= high)
		{
			var mid = Math.round((low + high) / 2);
			var bound = bounds[mid];
			if (bound.value > value)
			{
				high = mid - 1;
			}
			else if (bound.value < value)
			{
				low = mid + 1;
			}
			else
			{
				return parseInt(mid);
			}
		}
		
		return parseInt(low);
	}
// static attributes
b2BroadPhase.s_validate =  false;
b2BroadPhase.b2_invalid =  b2Settings.USHRT_MAX;
b2BroadPhase.b2_nullEdge =  b2Settings.USHRT_MAX;
// methods
b2BroadPhase.prototype.ComputeBounds = function (lowerValues, upperValues, aabb) {
		
		
		
		
		var minVertexX = aabb.lowerBound.x;
		var minVertexY = aabb.lowerBound.y;
		minVertexX = b2Math.Min(minVertexX, this.m_worldAABB.upperBound.x);
		minVertexY = b2Math.Min(minVertexY, this.m_worldAABB.upperBound.y);
		minVertexX = b2Math.Max(minVertexX, this.m_worldAABB.lowerBound.x);
		minVertexY = b2Math.Max(minVertexY, this.m_worldAABB.lowerBound.y);
		
		
		var maxVertexX = aabb.upperBound.x;
		var maxVertexY = aabb.upperBound.y;
		maxVertexX = b2Math.Min(maxVertexX, this.m_worldAABB.upperBound.x);
		maxVertexY = b2Math.Min(maxVertexY, this.m_worldAABB.upperBound.y);
		maxVertexX = b2Math.Max(maxVertexX, this.m_worldAABB.lowerBound.x);
		maxVertexY = b2Math.Max(maxVertexY, this.m_worldAABB.lowerBound.y);
		
		
		
		
		lowerValues[0] = parseInt(this.m_quantizationFactor.x * (minVertexX - this.m_worldAABB.lowerBound.x)) & (b2Settings.USHRT_MAX - 1);
		upperValues[0] = (parseInt(this.m_quantizationFactor.x * (maxVertexX - this.m_worldAABB.lowerBound.x))% 65535) | 1;
		
		lowerValues[1] = parseInt(this.m_quantizationFactor.y * (minVertexY - this.m_worldAABB.lowerBound.y)) & (b2Settings.USHRT_MAX - 1);
		upperValues[1] = (parseInt(this.m_quantizationFactor.y * (maxVertexY - this.m_worldAABB.lowerBound.y))% 65535) | 1;
	}
b2BroadPhase.prototype.TestOverlapValidate = function (p1, p2) {
		
		for (var axis = 0; axis < 2; ++axis)
		{
			var bounds = this.m_bounds[axis];
			
			
			
			
			
			
			var bound1 = bounds[p1.lowerBounds[axis]];
			var bound2 = bounds[p2.upperBounds[axis]];
			if (bound1.value > bound2.value)
				return false;
			
			bound1 = bounds[p1.upperBounds[axis]];
			bound2 = bounds[p2.lowerBounds[axis]];
			if (bound1.value < bound2.value)
				return false;
		}
		
		return true;
	}
b2BroadPhase.prototype.QueryAxis = function (lowerQueryOut, upperQueryOut, lowerValue, upperValue, bounds, boundCount, axis) {
		
		var lowerQuery = b2BroadPhase.BinarySearch(bounds, boundCount, lowerValue);
		var upperQuery = b2BroadPhase.BinarySearch(bounds, boundCount, upperValue);
		var bound;
		
		
		
		for (var j = lowerQuery; j < upperQuery; ++j)
		{
			bound = bounds[j];
			if (bound.IsLower())
			{
				this.IncrementOverlapCount(bound.proxy);
			}
		}
		
		
		
		if (lowerQuery > 0)
		{
			var i = lowerQuery - 1;
			bound = bounds[i];
			var s = bound.stabbingCount;
			
			
			while (s)
			{
				
				bound = bounds[i];
				if (bound.IsLower())
				{
					var proxy = bound.proxy;
					if (lowerQuery <= proxy.upperBounds[axis])
					{
						this.IncrementOverlapCount(bound.proxy);
						--s;
					}
				}
				--i;
			}
		}
		
		lowerQueryOut[0] = lowerQuery;
		upperQueryOut[0] = upperQuery;
	}
b2BroadPhase.prototype.IncrementOverlapCount = function (proxy) {
		if (proxy.timeStamp < this.m_timeStamp)
		{
			proxy.timeStamp = this.m_timeStamp;
			proxy.overlapCount = 1;
		}
		else
		{
			proxy.overlapCount = 2;
			
			this.m_queryResults[this.m_queryResultCount] = proxy;
			++this.m_queryResultCount;
		}
	}
b2BroadPhase.prototype.IncrementTimeStamp = function () {
		if (this.m_timeStamp == b2Settings.USHRT_MAX)
		{
			for (var i = 0; i < this.m_proxyPool.length; ++i)
			{
				(this.m_proxyPool[i]).timeStamp = 0;
			}
			this.m_timeStamp = 1;
		}
		else
		{
			++this.m_timeStamp;
		}
	}
b2BroadPhase.prototype.InRange = function (aabb) {
		
		var dX;
		var dY;
		var d2X;
		var d2Y;
		
		dX = aabb.lowerBound.x;
		dY = aabb.lowerBound.y;
		dX -= this.m_worldAABB.upperBound.x;
		dY -= this.m_worldAABB.upperBound.y;
		
		d2X = this.m_worldAABB.lowerBound.x;
		d2Y = this.m_worldAABB.lowerBound.y;
		d2X -= aabb.upperBound.x;
		d2Y -= aabb.upperBound.y;
		
		dX = b2Math.Max(dX, d2X);
		dY = b2Math.Max(dY, d2Y);
		
		return b2Math.Max(dX, dY) < 0.0;
	}
b2BroadPhase.prototype.CreateProxy = function (aabb, userData) {
		var index = 0;
		var proxy;
		var i = 0;
		var j = 0;
		
		
		
		
		if (!this.m_freeProxy)
		{
			
			this.m_freeProxy = this.m_proxyPool[this.m_proxyCount] = new b2Proxy();
			this.m_freeProxy.next = null;
			this.m_freeProxy.timeStamp = 0;
			this.m_freeProxy.overlapCount = b2BroadPhase.b2_invalid;
			this.m_freeProxy.userData = null;
			
			for (i = 0; i < 2; i++)
			{
				j = this.m_proxyCount * 2;
				this.m_bounds[i][j++] = new b2Bound();
				this.m_bounds[i][j] = new b2Bound();
			}
			
		}
		
		proxy = this.m_freeProxy;
		this.m_freeProxy = proxy.next;
		
		proxy.overlapCount = 0;
		proxy.userData = userData;
		
		var boundCount = 2 * this.m_proxyCount;
		
		var lowerValues = new Array();
		var upperValues = new Array();
		this.ComputeBounds(lowerValues, upperValues, aabb);
		
		for (var axis = 0; axis < 2; ++axis)
		{
			var bounds = this.m_bounds[axis];
			var lowerIndex = 0;
			var upperIndex = 0;
			var lowerIndexOut = new Array();
			lowerIndexOut.push(lowerIndex);
			var upperIndexOut = new Array();
			upperIndexOut.push(upperIndex);
			this.QueryAxis(lowerIndexOut, upperIndexOut, lowerValues[axis], upperValues[axis], bounds, boundCount, axis);
			lowerIndex = lowerIndexOut[0];
			upperIndex = upperIndexOut[0];
			
			bounds.splice(upperIndex, 0, bounds[bounds.length - 1]);
			bounds.length--;
			bounds.splice(lowerIndex, 0, bounds[bounds.length - 1]);
			bounds.length--;
			
			
			++upperIndex;
			
			
			var tBound1 = bounds[lowerIndex];
			var tBound2 = bounds[upperIndex];
			tBound1.value = lowerValues[axis];
			tBound1.proxy = proxy;
			tBound2.value = upperValues[axis];
			tBound2.proxy = proxy;
			
			var tBoundAS3 = bounds[parseInt(lowerIndex-1)];
			tBound1.stabbingCount = lowerIndex == 0 ? 0 : tBoundAS3.stabbingCount;
			tBoundAS3 = bounds[parseInt(upperIndex-1)];
			tBound2.stabbingCount = tBoundAS3.stabbingCount;
			
			
			for (index = lowerIndex; index < upperIndex; ++index)
			{
				tBoundAS3 = bounds[index];
				tBoundAS3.stabbingCount++;
			}
			
			
			for (index = lowerIndex; index < boundCount + 2; ++index)
			{
				tBound1 = bounds[index];
				var proxy2 = tBound1.proxy;
				if (tBound1.IsLower())
				{
					proxy2.lowerBounds[axis] = index;
				}
				else
				{
					proxy2.upperBounds[axis] = index;
				}
			}
		}
		
		++this.m_proxyCount;
		
		
		
		for (i = 0; i < this.m_queryResultCount; ++i)
		{
			
			
			
			this.m_pairManager.AddBufferedPair(proxy, this.m_queryResults[i]);
		}
		
		
		this.m_queryResultCount = 0;
		this.IncrementTimeStamp();
		
		return proxy;
	}
b2BroadPhase.prototype.DestroyProxy = function (proxy_) {
		var proxy = proxy_;
		var tBound1;
		var tBound2;
		
		
		
		var boundCount = 2 * this.m_proxyCount;
		
		for (var axis = 0; axis < 2; ++axis)
		{
			var bounds = this.m_bounds[axis];
			
			var lowerIndex = proxy.lowerBounds[axis];
			var upperIndex = proxy.upperBounds[axis];
			tBound1 = bounds[lowerIndex];
			var lowerValue = tBound1.value;
			tBound2 = bounds[upperIndex];
			var upperValue = tBound2.value;
			
			bounds.splice(upperIndex, 1);
			bounds.splice(lowerIndex, 1);
			bounds.push(tBound1);
			bounds.push(tBound2);
			
			
			
			var tEnd = boundCount - 2;
			for (var index = lowerIndex; index < tEnd; ++index)
			{
				tBound1 = bounds[index];
				var proxy2 = tBound1.proxy;
				if (tBound1.IsLower())
				{
					proxy2.lowerBounds[axis] = index;
				}
				else
				{
					proxy2.upperBounds[axis] = index;
				}
			}
			
			
			tEnd = upperIndex - 1;
			for (var index2 = lowerIndex; index2 < tEnd; ++index2)
			{
				tBound1 = bounds[index2];
				tBound1.stabbingCount--;
			}
			
			
			
			var ignore = new Array();
			this.QueryAxis(ignore, ignore, lowerValue, upperValue, bounds, boundCount - 2, axis);
		}
		
		
		
		for (var i = 0; i < this.m_queryResultCount; ++i)
		{
			
			
			this.m_pairManager.RemoveBufferedPair(proxy, this.m_queryResults[i]);
		}
		
		
		this.m_queryResultCount = 0;
		this.IncrementTimeStamp();
		
		
		proxy.userData = null;
		proxy.overlapCount = b2BroadPhase.b2_invalid;
		proxy.lowerBounds[0] = b2BroadPhase.b2_invalid;
		proxy.lowerBounds[1] = b2BroadPhase.b2_invalid;
		proxy.upperBounds[0] = b2BroadPhase.b2_invalid;
		proxy.upperBounds[1] = b2BroadPhase.b2_invalid;
		
		proxy.next = this.m_freeProxy;
		this.m_freeProxy = proxy;
		--this.m_proxyCount;
	}
b2BroadPhase.prototype.MoveProxy = function (proxy_, aabb, displacement) {
		var proxy = proxy_;
		
		var as3arr;
		var as3int = 0;
		
		var axis = 0;
		var index = 0;
		var bound;
		var prevBound;
		var nextBound;
		var nextProxyId = 0;
		var nextProxy;
		
		if (proxy == null)
		{
			
			return;
		}
		
		if (aabb.IsValid() == false)
		{
			
			return;
		}
		
		var boundCount = 2 * this.m_proxyCount;
		
		
		var newValues = new b2BoundValues();
		this.ComputeBounds(newValues.lowerValues, newValues.upperValues, aabb);
		
		
		var oldValues = new b2BoundValues();
		for (axis = 0; axis < 2; ++axis)
		{
			bound = this.m_bounds[axis][proxy.lowerBounds[axis]];
			oldValues.lowerValues[axis] = bound.value;
			bound = this.m_bounds[axis][proxy.upperBounds[axis]];
			oldValues.upperValues[axis] = bound.value;
		}
		
		for (axis = 0; axis < 2; ++axis)
		{
			var bounds = this.m_bounds[axis];
			
			var lowerIndex = proxy.lowerBounds[axis];
			var upperIndex = proxy.upperBounds[axis];
			
			var lowerValue = newValues.lowerValues[axis];
			var upperValue = newValues.upperValues[axis];
			
			bound = bounds[lowerIndex];
			var deltaLower = lowerValue - bound.value;
			bound.value = lowerValue;
			
			bound = bounds[upperIndex];
			var deltaUpper = upperValue - bound.value;
			bound.value = upperValue;
			
			
			
			
			
			
			if (deltaLower < 0)
			{
				index = lowerIndex;
				while (index > 0 && lowerValue < (bounds[parseInt(index-1)]).value)
				{
					bound = bounds[index];
					prevBound = bounds[parseInt(index - 1)];
					
					var prevProxy = prevBound.proxy;
					
					prevBound.stabbingCount++;
					
					if (prevBound.IsUpper() == true)
					{
						if (this.TestOverlapBound(newValues, prevProxy))
						{
							this.m_pairManager.AddBufferedPair(proxy, prevProxy);
						}
						
						
						as3arr = prevProxy.upperBounds;
						as3int = as3arr[axis];
						as3int++;
						as3arr[axis] = as3int;
						
						bound.stabbingCount++;
					}
					else
					{
						
						as3arr = prevProxy.lowerBounds;
						as3int = as3arr[axis];
						as3int++;
						as3arr[axis] = as3int;
						
						bound.stabbingCount--;
					}
					
					
					as3arr = proxy.lowerBounds;
					as3int = as3arr[axis];
					as3int--;
					as3arr[axis] = as3int;
					
					
					
					
					
					bound.Swap(prevBound);
					
					--index;
				}
			}
			
			
			if (deltaUpper > 0)
			{
				index = upperIndex;
				while (index < boundCount-1 && (bounds[parseInt(index+1)]).value <= upperValue)
				{
					bound = bounds[ index ];
					nextBound = bounds[ parseInt(index + 1) ];
					nextProxy = nextBound.proxy;
					
					nextBound.stabbingCount++;
					
					if (nextBound.IsLower() == true)
					{
						if (this.TestOverlapBound(newValues, nextProxy))
						{
							this.m_pairManager.AddBufferedPair(proxy, nextProxy);
						}
						
						
						as3arr = nextProxy.lowerBounds;
						as3int = as3arr[axis];
						as3int--;
						as3arr[axis] = as3int;
						
						bound.stabbingCount++;
					}
					else
					{
						
						as3arr = nextProxy.upperBounds;
						as3int = as3arr[axis];
						as3int--;
						as3arr[axis] = as3int;
						
						bound.stabbingCount--;
					}
					
					
					as3arr = proxy.upperBounds;
					as3int = as3arr[axis];
					as3int++;
					as3arr[axis] = as3int;
					
					
					
					
					
					bound.Swap(nextBound);
					
					index++;
				}
			}
			
			
			
			
			
			
			if (deltaLower > 0)
			{
				index = lowerIndex;
				while (index < boundCount-1 && (bounds[parseInt(index+1)]).value <= lowerValue)
				{
					bound = bounds[ index ];
					nextBound = bounds[ parseInt(index + 1) ];
					
					nextProxy = nextBound.proxy;
					
					nextBound.stabbingCount--;
					
					if (nextBound.IsUpper())
					{
						if (this.TestOverlapBound(oldValues, nextProxy))
						{
							this.m_pairManager.RemoveBufferedPair(proxy, nextProxy);
						}
						
						
						as3arr = nextProxy.upperBounds;
						as3int = as3arr[axis];
						as3int--;
						as3arr[axis] = as3int;
						
						bound.stabbingCount--;
					}
					else
					{
						
						as3arr = nextProxy.lowerBounds;
						as3int = as3arr[axis];
						as3int--;
						as3arr[axis] = as3int;
						
						bound.stabbingCount++;
					}
					
					
					as3arr = proxy.lowerBounds;
					as3int = as3arr[axis];
					as3int++;
					as3arr[axis] = as3int;
					
					
					
					
					
					bound.Swap(nextBound);
					
					index++;
				}
			}
			
			
			if (deltaUpper < 0)
			{
				index = upperIndex;
				while (index > 0 && upperValue < (bounds[parseInt(index-1)]).value)
				{
					bound = bounds[index];
					prevBound = bounds[parseInt(index - 1)];
					
					prevProxy = prevBound.proxy;
					
					prevBound.stabbingCount--;
					
					if (prevBound.IsLower() == true)
					{
						if (this.TestOverlapBound(oldValues, prevProxy))
						{
							this.m_pairManager.RemoveBufferedPair(proxy, prevProxy);
						}
						
						
						as3arr = prevProxy.lowerBounds;
						as3int = as3arr[axis];
						as3int++;
						as3arr[axis] = as3int;
						
						bound.stabbingCount--;
					}
					else
					{
						
						as3arr = prevProxy.upperBounds;
						as3int = as3arr[axis];
						as3int++;
						as3arr[axis] = as3int;
						
						bound.stabbingCount++;
					}
					
					
					as3arr = proxy.upperBounds;
					as3int = as3arr[axis];
					as3int--;
					as3arr[axis] = as3int;
					
					
					
					
					
					bound.Swap(prevBound);
					
					index--;
				}
			}
		}
	}
b2BroadPhase.prototype.UpdatePairs = function (callback) {
		this.m_pairManager.Commit(callback);
	}
b2BroadPhase.prototype.TestOverlap = function (proxyA, proxyB) {
		var proxyA_ = proxyA;
		var proxyB_ = proxyB;
		if ( proxyA_.lowerBounds[0] > proxyB_.upperBounds[0]) return false;
		if ( proxyB_.lowerBounds[0] > proxyA_.upperBounds[0]) return false;
		if ( proxyA_.lowerBounds[1] > proxyB_.upperBounds[1]) return false;
		if ( proxyB_.lowerBounds[1] > proxyA_.upperBounds[1]) return false;
		return true;
	}
b2BroadPhase.prototype.GetUserData = function (proxy) {
		return (proxy).userData;
	}
b2BroadPhase.prototype.GetFatAABB = function (proxy_) {
		var aabb = new b2AABB();
		var proxy = proxy_;
		aabb.lowerBound.x = this.m_worldAABB.lowerBound.x + this.m_bounds[0][proxy.lowerBounds[0]].value / this.m_quantizationFactor.x;
		aabb.lowerBound.y = this.m_worldAABB.lowerBound.y + this.m_bounds[1][proxy.lowerBounds[1]].value / this.m_quantizationFactor.y;
		aabb.upperBound.x = this.m_worldAABB.lowerBound.x + this.m_bounds[0][proxy.upperBounds[0]].value / this.m_quantizationFactor.x;
		aabb.upperBound.y = this.m_worldAABB.lowerBound.y + this.m_bounds[1][proxy.upperBounds[1]].value / this.m_quantizationFactor.y;
		return aabb;
	}
b2BroadPhase.prototype.GetProxyCount = function () {
		return this.m_proxyCount;
	}
b2BroadPhase.prototype.Query = function (callback, aabb) {
		var lowerValues = new Array();
		var upperValues = new Array();
		this.ComputeBounds(lowerValues, upperValues, aabb);
		
		var lowerIndex = 0;
		var upperIndex = 0;
		var lowerIndexOut = new Array();
		lowerIndexOut.push(lowerIndex);
		var upperIndexOut = new Array();
		upperIndexOut.push(upperIndex);
		this.QueryAxis(lowerIndexOut, upperIndexOut, lowerValues[0], upperValues[0], this.m_bounds[0], 2*this.m_proxyCount, 0);
		this.QueryAxis(lowerIndexOut, upperIndexOut, lowerValues[1], upperValues[1], this.m_bounds[1], 2*this.m_proxyCount, 1);
		
		
		
		
		for (var i = 0; i < this.m_queryResultCount; ++i)
		{
			var proxy = this.m_queryResults[i];
			
			if (!callback(proxy))
			{
				break;
			}
		}
		
		
		this.m_queryResultCount = 0;
		this.IncrementTimeStamp();
	}
b2BroadPhase.prototype.Validate = function () {
		var pair;
		var proxy1;
		var proxy2;
		var overlap;
		
		for (var axis = 0; axis < 2; ++axis)
		{
			var bounds = this.m_bounds[axis];
			
			var boundCount = 2 * this.m_proxyCount;
			var stabbingCount = 0;
			
			for (var i = 0; i < boundCount; ++i)
			{
				var bound = bounds[i];
				
				
				
				
				if (bound.IsLower() == true)
				{
					
					stabbingCount++;
				}
				else
				{
					
					stabbingCount--;
				}
				
				
			}
		}
		
	}
b2BroadPhase.prototype.Rebalance = function (iterations) {
		
	}
b2BroadPhase.prototype.RayCast = function (callback, input) {
		var subInput = new b2RayCastInput();
		subInput.p1.SetV(input.p1);
		subInput.p2.SetV(input.p2);
		subInput.maxFraction = input.maxFraction;
		
		
		var dx = (input.p2.x-input.p1.x)*this.m_quantizationFactor.x;
		var dy = (input.p2.y-input.p1.y)*this.m_quantizationFactor.y;
		
		var sx = dx<-Number.MIN_VALUE ? -1 : (dx>Number.MIN_VALUE ? 1 : 0);
		var sy = dy<-Number.MIN_VALUE ? -1 : (dy>Number.MIN_VALUE ? 1 : 0);
		
		
		
		var p1x = this.m_quantizationFactor.x * (input.p1.x - this.m_worldAABB.lowerBound.x);
		var p1y = this.m_quantizationFactor.y * (input.p1.y - this.m_worldAABB.lowerBound.y);
		
		var startValues = new Array();
		var startValues2 = new Array();
		startValues[0]=parseInt(p1x) & (b2Settings.USHRT_MAX - 1);
		startValues[1]=parseInt(p1y) & (b2Settings.USHRT_MAX - 1);
		startValues2[0]=startValues[0]+1;
		startValues2[1]=startValues[1]+1;
		
		var startIndices = new Array();
		
		var xIndex = 0;
		var yIndex = 0;
		
		var proxy;
		
		
		
		var lowerIndex = 0;
		var upperIndex = 0;
		var lowerIndexOut = new Array(); 
		lowerIndexOut.push(lowerIndex);
		var upperIndexOut = new Array();
		upperIndexOut.push(upperIndex);
		this.QueryAxis(lowerIndexOut, upperIndexOut, startValues[0], startValues2[0], this.m_bounds[0], 2*this.m_proxyCount, 0);
		if(sx>=0)	xIndex = upperIndexOut[0]-1;
		else		xIndex = lowerIndexOut[0];
		this.QueryAxis(lowerIndexOut, upperIndexOut, startValues[1], startValues2[1], this.m_bounds[1], 2*this.m_proxyCount, 1);
		if(sy>=0)	yIndex = upperIndexOut[0]-1;
		else		yIndex = lowerIndexOut[0];
			
		
		for (var i = 0; i < this.m_queryResultCount; i++) {
			subInput.maxFraction = callback(this.m_queryResults[i], subInput);
		}
		
		
		for (;; )
		{
			var xProgress = 0;
			var yProgress = 0;
			
			xIndex += sx >= 0?1: -1;
			if(xIndex<0||xIndex>=this.m_proxyCount*2)
				break;
			if(sx!=0){
				xProgress = (this.m_bounds[0][xIndex].value - p1x) / dx;
			}
			
			yIndex += sy >= 0?1: -1;
			if(yIndex<0||yIndex>=this.m_proxyCount*2)
				break;
			if(sy!=0){
				yProgress = (this.m_bounds[1][yIndex].value - p1y) / dy;	
			}
			for (;; )
			{	
				if(sy==0||(sx!=0&&xProgress<yProgress)){
					if(xProgress>subInput.maxFraction)
						break;
					
					
					if(sx>0?this.m_bounds[0][xIndex].IsLower():this.m_bounds[0][xIndex].IsUpper()){
						
						proxy = this.m_bounds[0][xIndex].proxy;
						if(sy>=0){
							if(proxy.lowerBounds[1]<=yIndex-1&&proxy.upperBounds[1]>=yIndex){
								
								subInput.maxFraction = callback(proxy, subInput);
							}
						}else{
							if(proxy.lowerBounds[1]<=yIndex&&proxy.upperBounds[1]>=yIndex+1){
								
								subInput.maxFraction = callback(proxy, subInput);
							}
						}
					}
					
					
					if(subInput.maxFraction==0)
						break;
					
					
					if(sx>0){
						xIndex++;
						if(xIndex==this.m_proxyCount*2)
							break;
					}else{
						xIndex--;
						if(xIndex<0)
							break;
					}
					xProgress = (this.m_bounds[0][xIndex].value - p1x) / dx;
				}else{
					if(yProgress>subInput.maxFraction)
						break;
					
					
					if(sy>0?this.m_bounds[1][yIndex].IsLower():this.m_bounds[1][yIndex].IsUpper()){
						
						proxy = this.m_bounds[1][yIndex].proxy;
						if(sx>=0){
							if(proxy.lowerBounds[0]<=xIndex-1&&proxy.upperBounds[0]>=xIndex){
								
								subInput.maxFraction = callback(proxy, subInput);
							}
						}else{
							if(proxy.lowerBounds[0]<=xIndex&&proxy.upperBounds[0]>=xIndex+1){
								
								subInput.maxFraction = callback(proxy, subInput);
							}
						}
					}
					
					
					if(subInput.maxFraction==0)
						break;
					
					
					if(sy>0){
						yIndex++;
						if(yIndex==this.m_proxyCount*2)
							break;
					}else{
						yIndex--;
						if(yIndex<0)
							break;
					}
					yProgress = (this.m_bounds[1][yIndex].value - p1y) / dy;
				}
			}
			break;
		}
		
		
		this.m_queryResultCount = 0;
		this.IncrementTimeStamp();
		
		return;
	}
b2BroadPhase.prototype.TestOverlapBound = function (b, p) {
		for (var axis = 0; axis < 2; ++axis)
		{
			var bounds = this.m_bounds[axis];
			
			
			
			
			var bound = bounds[p.upperBounds[axis]];
			if (b.lowerValues[axis] > bound.value)
				return false;
			
			bound = bounds[p.lowerBounds[axis]];
			if (b.upperValues[axis] < bound.value)
				return false;
		}
		
		return true;
	}
// attributes
b2BroadPhase.prototype.m_pairManager =  new b2PairManager();
b2BroadPhase.prototype.m_proxyPool =  new Array();
b2BroadPhase.prototype.m_freeProxy =  null;
b2BroadPhase.prototype.m_bounds =  null;
b2BroadPhase.prototype.m_querySortKeys =  new Array();
b2BroadPhase.prototype.m_queryResults =  new Array();
b2BroadPhase.prototype.m_queryResultCount =  0;
b2BroadPhase.prototype.m_worldAABB =  null;
b2BroadPhase.prototype.m_quantizationFactor =  new b2Vec2();
b2BroadPhase.prototype.m_proxyCount =  0;
b2BroadPhase.prototype.m_timeStamp =  0;