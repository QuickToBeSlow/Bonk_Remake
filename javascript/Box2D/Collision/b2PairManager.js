var b2PairManager = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2PairManager.prototype.__constructor = function () {
		this.m_pairs = new Array();
		this.m_pairBuffer = new Array();
		this.m_pairCount = 0;
		this.m_pairBufferCount = 0;
		this.m_freePair = null;
	}
b2PairManager.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
b2PairManager.prototype.AddPair = function (proxy1, proxy2) {
		var pair = proxy1.pairs[proxy2];
		
		if (pair != null)
			return pair;
		
		if (this.m_freePair == null)
		{
			this.m_freePair = new b2Pair();
			this.m_pairs.push(this.m_freePair);
		}
		pair = this.m_freePair;
		this.m_freePair = pair.next;
		
		pair.proxy1 = proxy1;
		pair.proxy2 = proxy2;
		pair.status = 0;
		pair.userData = null;
		pair.next = null;
		
		proxy1.pairs[proxy2] = pair;
		proxy2.pairs[proxy1] = pair;
				
		++this.m_pairCount;
		
		return pair;
	}
b2PairManager.prototype.RemovePair = function (proxy1, proxy2) {
		
		
		var pair = proxy1.pairs[proxy2];
		
		if (pair == null)
		{
			
			return null;
		}
		
		var userData = pair.userData;
		
		delete proxy1.pairs[proxy2];
		delete proxy2.pairs[proxy1];
		
		
		pair.next = this.m_freePair;
		pair.proxy1 = null;
		pair.proxy2 = null;
		pair.userData = null;
		pair.status = 0;
		
		this.m_freePair = pair;
		--this.m_pairCount;
		return userData;
	}
b2PairManager.prototype.Find = function (proxy1, proxy2) {
		
		return proxy1.pairs[proxy2];
	}
b2PairManager.prototype.ValidateBuffer = function () {
		
	}
b2PairManager.prototype.ValidateTable = function () {
		
	}
b2PairManager.prototype.Initialize = function (broadPhase) {
		this.m_broadPhase = broadPhase;
	}
b2PairManager.prototype.AddBufferedPair = function (proxy1, proxy2) {
		
		
		var pair = this.AddPair(proxy1, proxy2);
		
		
		if (pair.IsBuffered() == false)
		{
			
			
			
			
			pair.SetBuffered();
			this.m_pairBuffer[this.m_pairBufferCount] = pair;
			++this.m_pairBufferCount;
			
		}
		
		
		pair.ClearRemoved();
		
		if (b2BroadPhase.s_validate)
		{
			this.ValidateBuffer();
		}
	}
b2PairManager.prototype.RemoveBufferedPair = function (proxy1, proxy2) {
		
		
		var pair = this.Find(proxy1, proxy2);
		
		if (pair == null)
		{
			
			return;
		}
		
		
		if (pair.IsBuffered() == false)
		{
			
			
			
			pair.SetBuffered();
			this.m_pairBuffer[this.m_pairBufferCount] = pair;
			++this.m_pairBufferCount;
			
			
		}
		
		pair.SetRemoved();
		
		if (b2BroadPhase.s_validate)
		{
			this.ValidateBuffer();
		}
	}
b2PairManager.prototype.Commit = function (callback) {
		var i = 0;
		
		var removeCount = 0;
		
		for (i = 0; i < this.m_pairBufferCount; ++i)
		{
			var pair = this.m_pairBuffer[i];
			
			pair.ClearBuffered();
			
			
			
			var proxy1 = pair.proxy1;
			var proxy2 = pair.proxy2;
			
			
			
			
			if (pair.IsRemoved())
			{
				
				
				
				
				
				
				
				
				
				
				
			}
			else
			{
				
				
				if (pair.IsFinal() == false)
				{
					
					
					callback(proxy1.userData, proxy2.userData);
				}
			}
		}
		
		
		
		
		
		
		
		this.m_pairBufferCount = 0;
		
		if (b2BroadPhase.s_validate)
		{
			this.ValidateTable();
		}	
	}
// attributes
b2PairManager.prototype.m_broadPhase =  null;
b2PairManager.prototype.m_pairs =  null;
b2PairManager.prototype.m_freePair =  null;
b2PairManager.prototype.m_pairCount =  0;
b2PairManager.prototype.m_pairBuffer =  null;
b2PairManager.prototype.m_pairBufferCount =  0;