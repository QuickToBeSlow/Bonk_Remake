var b2TimeOfImpact = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2TimeOfImpact.prototype.__constructor = function(){}
b2TimeOfImpact.prototype.__varz = function(){
}
// static methods
b2TimeOfImpact.TimeOfImpact = function (input) {
		++b2TimeOfImpact.b2_toiCalls;
		
		var proxyA = input.proxyA;
		var proxyB = input.proxyB;
		
		var sweepA = input.sweepA;
		var sweepB = input.sweepB;
		
		b2Settings.b2Assert(sweepA.t0 == sweepB.t0);
		b2Settings.b2Assert(1.0 - sweepA.t0 > Number.MIN_VALUE);
		
		var radius = proxyA.m_radius + proxyB.m_radius;
		var tolerance = input.tolerance;
		
		var alpha = 0.0;
		
		var k_maxIterations = 1000; 
		var iter = 0;
		var target = 0.0;
		
		
		b2TimeOfImpact.s_cache.count = 0;
		b2TimeOfImpact.s_distanceInput.useRadii = false;
		
		for (;; )
		{
			sweepA.GetTransform(b2TimeOfImpact.s_xfA, alpha);
			sweepB.GetTransform(b2TimeOfImpact.s_xfB, alpha);
			
			
			b2TimeOfImpact.s_distanceInput.proxyA = proxyA;
			b2TimeOfImpact.s_distanceInput.proxyB = proxyB;
			b2TimeOfImpact.s_distanceInput.transformA = b2TimeOfImpact.s_xfA;
			b2TimeOfImpact.s_distanceInput.transformB = b2TimeOfImpact.s_xfB;
			
			b2Distance.Distance(b2TimeOfImpact.s_distanceOutput, b2TimeOfImpact.s_cache, b2TimeOfImpact.s_distanceInput);
			
			if (b2TimeOfImpact.s_distanceOutput.distance <= 0.0)
			{
				alpha = 1.0;
				break;
			}
			
			b2TimeOfImpact.s_fcn.Initialize(b2TimeOfImpact.s_cache, proxyA, b2TimeOfImpact.s_xfA, proxyB, b2TimeOfImpact.s_xfB);
			
			var separation = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
			if (separation <= 0.0)
			{
				alpha = 1.0;
				break;
			}
			
			if (iter == 0)
			{
				
				
				
				if (separation > radius)
				{
					target = b2Math.Max(radius - tolerance, 0.75 * radius);
				}
				else
				{
					target = b2Math.Max(separation - tolerance, 0.02 * radius);
				}
			}
			
			if (separation - target < 0.5 * tolerance)
			{
				if (iter == 0)
				{
					alpha = 1.0;
					break;
				}
				break;
			}
			

			
			
				
				
				
				
				
				
				
				
					
					
					
					
					
					
					
					
					
				
			

			
			var newAlpha = alpha;
			{
				var x1 = alpha;
				var x2 = 1.0;
				
				var f1 = separation;
				
				sweepA.GetTransform(b2TimeOfImpact.s_xfA, x2);
				sweepB.GetTransform(b2TimeOfImpact.s_xfB, x2);
				
				var f2 = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
				
				
				if (f2 >= target)
				{
					alpha = 1.0;
					break;
				}
				
				
				var rootIterCount = 0;
				for (;; )
				{
					
					var x;
					if (rootIterCount & 1)
					{
						
						x = x1 + (target - f1) * (x2 - x1) / (f2 - f1);
					}
					else
					{
						
						x = 0.5 * (x1 + x2);
					}
					
					sweepA.GetTransform(b2TimeOfImpact.s_xfA, x);
					sweepB.GetTransform(b2TimeOfImpact.s_xfB, x);
					
					var f = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
					
					if (b2Math.Abs(f - target) < 0.025 * tolerance)
					{
						newAlpha = x;
						break;
					}
					
					
					if (f > target)
					{
						x1 = x;
						f1 = f;
					}
					else
					{
						x2 = x;
						f2 = f;
					}
					
					++rootIterCount;
					++b2TimeOfImpact.b2_toiRootIters;
					if (rootIterCount == 50)
					{
						break;
					}
				}
				
				b2TimeOfImpact.b2_toiMaxRootIters = b2Math.Max(b2TimeOfImpact.b2_toiMaxRootIters, rootIterCount);
			}
			
			
			if (newAlpha < (1.0 + 100.0 * Number.MIN_VALUE) * alpha)
			{
				break;
			}
			
			alpha = newAlpha;
			
			iter++;
			++b2TimeOfImpact.b2_toiIters;
			
			if (iter == k_maxIterations)
			{
				break;
			}
		}
		
		b2TimeOfImpact.b2_toiMaxIters = b2Math.Max(b2TimeOfImpact.b2_toiMaxIters, iter);

		return alpha;
	}
// static attributes
b2TimeOfImpact.b2_toiCalls =  0;
b2TimeOfImpact.b2_toiIters =  0;
b2TimeOfImpact.b2_toiMaxIters =  0;
b2TimeOfImpact.b2_toiRootIters =  0;
b2TimeOfImpact.b2_toiMaxRootIters =  0;
b2TimeOfImpact.s_cache =  new b2SimplexCache();
b2TimeOfImpact.s_distanceInput =  new b2DistanceInput();
b2TimeOfImpact.s_xfA =  new b2Transform();
b2TimeOfImpact.s_xfB =  new b2Transform();
b2TimeOfImpact.s_fcn =  new b2SeparationFunction();
b2TimeOfImpact.s_distanceOutput =  new b2DistanceOutput();
// methods
// attributes