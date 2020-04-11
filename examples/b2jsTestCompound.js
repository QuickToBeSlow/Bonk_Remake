(function(){

var Test = function() {
	b2jsTest.__constructor.apply(this, arguments);
};
extend(Test.prototype, b2jsTest.prototype)

Test.prototype.createWorld = function() {
	var world = b2jsTest.prototype.createWorld.apply(this, arguments);
	var m_physScale = 10;
	
	var bd;
	var body;
	var i;
	var x;
	
	{
		var cd1 = new b2CircleShape();
		cd1.SetRadius(15.0/m_physScale);
		cd1.SetLocalPosition(new b2Vec2( -15.0 / m_physScale, 15.0 / m_physScale));
		
		var cd2 = new b2CircleShape();
		cd2.SetRadius(15.0/m_physScale);
		cd2.SetLocalPosition(new b2Vec2(15.0 / m_physScale, 15.0 / m_physScale));
		
		bd = new b2BodyDef();
		bd.type = b2Body.b2_dynamicBody;
		
		for (i = 0; i < 5; ++i)
		{
			x = 320.0 + b2Math.RandomRange(-3.0, 3.0);
			bd.position.Set((x + 150.0)/m_physScale, (31.5 + 60.0 * -i + 300.0)/m_physScale);
			bd.angle = b2Math.RandomRange(-Math.PI, Math.PI);
			body = world.CreateBody(bd);
			body.CreateFixture2(cd1, 2.0);
			body.CreateFixture2(cd2, 0.0);
		}
	}
	
	{
		var pd1 = new b2PolygonShape();
		pd1.SetAsBox(7.5/m_physScale, 15.0/m_physScale);
		
		var pd2 = new b2PolygonShape();
		pd2.SetAsOrientedBox(7.5/m_physScale, 15.0/m_physScale, new b2Vec2(0.0, -15.0/m_physScale), 0.5 * Math.PI);
		
		bd = new b2BodyDef();
		bd.type = b2Body.b2_dynamicBody;
		
		for (i = 0; i < 5; ++i)
		{
			x = 320.0 + b2Math.RandomRange(-3.0, 3.0);
			bd.position.Set((x - 150.0)/m_physScale, (31.5 + 60.0 * -i + 300)/m_physScale);
			bd.angle = b2Math.RandomRange(-Math.PI, Math.PI);
			body = world.CreateBody(bd);
			body.CreateFixture2(pd1, 2.0);
			body.CreateFixture2(pd2, 2.0);
		}
	}
	
	{
		var xf1 = new b2Transform();
		xf1.R.Set(0.3524 * Math.PI);
		xf1.position = b2Math.MulMV(xf1.R, new b2Vec2(-1, 0));
		
		var sd1 = new b2PolygonShape();
		sd1.SetAsArray([
			b2Math.MulX(xf1, new b2Vec2(-30.0/m_physScale, 0.0)),
			b2Math.MulX(xf1, new b2Vec2(0.0, -15.0 / m_physScale)),
			b2Math.MulX(xf1, new b2Vec2(30.0/m_physScale, 0.0)),
			]);
		
		var xf2 = new b2Transform();
		xf2.R.Set(-0.3524 * Math.PI);
		xf2.position = b2Math.MulMV(xf2.R, new b2Vec2(1.7, 1.7));

		var sd2 = new b2PolygonShape();
		sd2.SetAsArray([
			b2Math.MulX(xf2, new b2Vec2(-30.0/m_physScale, 0.0)),
			b2Math.MulX(xf2, new b2Vec2(0.0, -15.0 / m_physScale)),
			b2Math.MulX(xf2, new b2Vec2(30.0/m_physScale, 0.0)),
			]);
		
		bd = new b2BodyDef();
		bd.type = b2Body.b2_dynamicBody;
		bd.fixedRotation = true;
		
		for (i = 0; i < 5; ++i)
		{
			x = 320.0 + b2Math.RandomRange(-3.0, 3.0);
			bd.position.Set(x/m_physScale, (40 + 55.0 * -i + 300)/m_physScale);
			bd.angle = 0.0;
			body = world.CreateBody(bd);
			body.CreateFixture2(sd1, 2.0);
			body.CreateFixture2(sd2, 2.0);
		}
	}
	
	{
		var sd_bottom = new b2PolygonShape();
		sd_bottom.SetAsBox( 45.0/m_physScale, 4.5/m_physScale );
		
		var sd_left = new b2PolygonShape();
		sd_left.SetAsOrientedBox(4.5/m_physScale, 81.0/m_physScale, new b2Vec2(-43.5/m_physScale, -70.5/m_physScale), -0.2);
		
		var sd_right = new b2PolygonShape();
		sd_right.SetAsOrientedBox(4.5/m_physScale, 81.0/m_physScale, new b2Vec2(43.5/m_physScale, -70.5/m_physScale), 0.2);
		
		bd = new b2BodyDef();
		bd.type = b2Body.b2_dynamicBody;
		bd.position.Set( 330.0/m_physScale, 40.0/m_physScale );
		bd.angle = 1.03 * Math.PI;
		body = world.CreateBody(bd);
		body.CreateFixture2(sd_bottom, 4.0);
		body.CreateFixture2(sd_left, 4.0);
		body.CreateFixture2(sd_right, 4.0);
	}
	
	return world;
};

window.b2jsTestCompound = Test;
	
})();