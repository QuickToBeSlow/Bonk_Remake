(function(){

var Test = function() {
	b2jsTest.__constructor.apply(this, arguments);
};
extend(Test.prototype, b2jsTest.prototype)

Test.prototype.createWorld = function() {
	var world = b2jsTest.prototype.createWorld.apply(this, arguments);
	
	var m_physScale = 10;
	
	var ground = world.GetGroundBody();
	
	var body;
	var circleBody;
	var sd;
	var bd;
	var fixtureDef = new b2FixtureDef();
	
	//
	// CRANK
	//
	{
		// Define crank.
		sd = new b2PolygonShape();
		sd.SetAsBox(7.5 / m_physScale, 30.0 / m_physScale);
		fixtureDef.shape = sd;
		fixtureDef.density = 1.0;
		
		var rjd = new b2RevoluteJointDef();
		
		var prevBody = ground;
		
		bd = new b2BodyDef();
		bd.type = b2Body.b2_dynamicBody;
		bd.userData = "crank";
		bd.position.Set(100.0/m_physScale, (125.0)/m_physScale);
		body = world.CreateBody(bd);
		body.CreateFixture(fixtureDef);
		
		rjd.Initialize(prevBody, body, new b2Vec2(100.0/m_physScale, (95.0)/m_physScale));
		rjd.motorSpeed = 1.0 * -Math.PI;
		rjd.maxMotorTorque = 4400.0;
		rjd.enableMotor = true;
		m_joint1 = world.CreateJoint(rjd);
		
		prevBody = body;
		
		// Define follower.
		
		sd = new b2PolygonShape;
		sd.SetAsBox(7.5 / m_physScale, 60.0 / m_physScale);
		sd.userData = "follower";
		fixtureDef.shape = sd;
		bd.position.Set(100.0/m_physScale, (215.0)/m_physScale);
		body = world.CreateBody(bd);
		body.CreateFixture(fixtureDef);
		
		rjd.Initialize(prevBody, body, new b2Vec2(100.0/m_physScale, (155.0)/m_physScale));
		rjd.enableMotor = false;
		world.CreateJoint(rjd);
		
		prevBody = body;
		
		// Define piston
		sd = new b2PolygonShape();
		sd.SetAsBox(22.5 / m_physScale, 22.5 / m_physScale);
		fixtureDef.shape = sd;
		bd.position.Set(100.0/m_physScale, (275.0)/m_physScale);
		body = world.CreateBody(bd);
		body.CreateFixture(fixtureDef);
		
		rjd.Initialize(prevBody, body, new b2Vec2(100.0/m_physScale, (275.0)/m_physScale));
		world.CreateJoint(rjd);
		
		var pjd = new b2PrismaticJointDef();
		pjd.Initialize(ground, body, new b2Vec2(100.0/m_physScale, (275.0)/m_physScale), new b2Vec2(0.0, 1.0));
		
		pjd.maxMotorForce = 200.0;
		pjd.enableMotor = true;
		
		m_joint2 = world.CreateJoint(pjd);
		
		
		// Create a payload
		
		sd = new b2PolygonShape()
		sd.SetAsBox(12.5 / m_physScale, 12.5 / m_physScale);
		fixtureDef.shape = sd;
		fixtureDef.density = 2.0;
		bd.position.Set(110.0/m_physScale, (345.0)/m_physScale);
		body = world.CreateBody(bd);
		body.CreateFixture(fixtureDef);
		
	}
	
	// 
	// GEARS
	//
	{
		var circle1 = new b2CircleShape(25 / m_physScale);
		fixtureDef.shape = circle1;
		fixtureDef.density = 5.0;
		
		var bd1 = new b2BodyDef();
		bd1.type = b2Body.b2_dynamicBody;
		bd1.position.Set(200 / m_physScale, 360/2 / m_physScale);
		var body1 = world.CreateBody(bd1);
		body1.CreateFixture(fixtureDef);
		
		var jd1 = new b2RevoluteJointDef();
		jd1.Initialize(ground, body1, bd1.position);
		m_gJoint1 = world.CreateJoint(jd1);
		
		var circle2 = new b2CircleShape(50 / m_physScale);
		fixtureDef.shape = circle2;
		fixtureDef.density = 5.0;
		
		var bd2 = new b2BodyDef();
		bd2.type = b2Body.b2_dynamicBody;
		bd2.position.Set(275 / m_physScale, 360/2 / m_physScale);
		var body2 = world.CreateBody(bd2);
		body2.CreateFixture(fixtureDef);
		
		var jd2 = new b2RevoluteJointDef();
		jd2.Initialize(ground, body2, bd2.position);
		m_gJoint2 = world.CreateJoint(jd2);
		
		var box = new b2PolygonShape();
		box.SetAsBox(10 / m_physScale, 100 / m_physScale);
		fixtureDef.shape = box;
		fixtureDef.density = 2.2;
		
		var bd3 = new b2BodyDef();
		bd3.type = b2Body.b2_dynamicBody;
		bd3.position.Set(335 / m_physScale, 360/2 / m_physScale);
		var body3 = world.CreateBody(bd3);
		body3.CreateFixture(fixtureDef);
		
		var jd3 = new b2PrismaticJointDef();
		jd3.Initialize(ground, body3, bd3.position, new b2Vec2(0,1));
		jd3.lowerTranslation = -75.0 / m_physScale;
		jd3.upperTranslation = 100.0 / m_physScale;
		jd3.enableLimit = true;
		
		m_gJoint3 = world.CreateJoint(jd3);
		
		var jd4 = new b2GearJointDef();
		jd4.bodyA = body1;
		jd4.bodyB = body2;
		jd4.joint1 = m_gJoint1;
		jd4.joint2 = m_gJoint2;
		jd4.ratio = circle2.GetRadius() / circle1.GetRadius();
		m_gJoint4 = world.CreateJoint(jd4);
		
		var jd5 = new b2GearJointDef();
		jd5.bodyA = body2;
		jd5.bodyB = body3;
		jd5.joint1 = m_gJoint2;
		jd5.joint2 = m_gJoint3;
		jd5.ratio = -1.0 / circle2.GetRadius();
		m_gJoint5 = world.CreateJoint(jd5);
	}	
	
	//
	// PULLEY
	//
	{
		sd = new b2PolygonShape();
		sd.SetAsBox(50 / m_physScale, 20 / m_physScale);
		fixtureDef.shape = sd;
		fixtureDef.density = 5.0;
		
		bd = new b2BodyDef();
		bd.type = b2Body.b2_dynamicBody;
		
		bd.position.Set(480 / m_physScale, 160 / m_physScale);
		body2 = world.CreateBody(bd);
		body2.CreateFixture(fixtureDef);
		
		var pulleyDef = new b2PulleyJointDef();
		
		var anchor1 = new b2Vec2(335 / m_physScale, 180 / m_physScale);
		var anchor2 = new b2Vec2(480 / m_physScale, 180 / m_physScale);
		var groundAnchor1 = new b2Vec2(335 / m_physScale, 310 / m_physScale);
		var groundAnchor2 = new b2Vec2(480 / m_physScale, 310 / m_physScale);
		pulleyDef.Initialize(body3, body2, groundAnchor1, groundAnchor2, anchor1, anchor2, 2.0);
		
		pulleyDef.maxLengthA = 200 / m_physScale;
		pulleyDef.maxLengthB = 150 / m_physScale;
		
		//m_joint1 = m_world.CreateJoint(pulleyDef) as b2PulleyJoint;
		world.CreateJoint(pulleyDef);
		
		
		// Add a circle to weigh down the pulley
		var circ = new b2CircleShape(20 / m_physScale);
		fixtureDef.shape = circ;
		fixtureDef.friction = 0.3;
		fixtureDef.restitution = 0.3;
		fixtureDef.density = 25.0;
		bd.position.Set(481 / m_physScale, 280 / m_physScale);
		circleBody = world.CreateBody(bd);
		circleBody.CreateFixture(fixtureDef);
	}
	
	//
	// LINE JOINT
	//
	{
		sd = new b2PolygonShape();
		sd.SetAsBox(7.5 / m_physScale, 30.0 / m_physScale);
		fixtureDef.shape = sd;
		fixtureDef.density = 1.0;
		
		bd = new b2BodyDef();
		bd.type = b2Body.b2_dynamicBody;
		bd.position.Set(400 / m_physScale, 500/2 / m_physScale);
		body = world.CreateBody(bd);
		body.CreateFixture(fixtureDef);
		
		var ljd = new b2LineJointDef();
		ljd.Initialize(ground, body, body.GetPosition(), new b2Vec2(-0.4, 0.6));
		
		ljd.lowerTranslation = -3;
		ljd.upperTranslation = 1;
		ljd.enableLimit = true;
		
		ljd.maxMotorForce = 100;
		ljd.motorSpeed = -2;
		ljd.enableMotor = true;
		
		world.CreateJoint(ljd);
	}	
	
	// RAMP
	var vxs = [new b2Vec2(400 / m_physScale, 0),
		
		new b2Vec2(640 / m_physScale, 0),
		new b2Vec2(640 / m_physScale, 100 / m_physScale)];
	sd.SetAsArray(vxs, vxs.length);
	fixtureDef.density = 0;
	bd.type = b2Body.b2_staticBody;
	bd.userData = "ramp";
	bd.position.Set(0, 0);
	b = world.CreateBody(bd);
	b.CreateFixture(fixtureDef);
	
	// SOME BALLS
	circ = new b2CircleShape(10 / m_physScale);
	fixtureDef.shape = circ;
	fixtureDef.friction = 0.1;
	fixtureDef.restitution = 0.3;
	fixtureDef.density = 3.0;
	for(i = 0; i<15; i++) {
		bd.position.Set((25) / m_physScale, (15 + i * 20) / m_physScale);
		bd.type = b2Body.b2_dynamicBody;
		circleBody = world.CreateBody(bd);
		circleBody.CreateFixture(fixtureDef);
	}
	
	
	return world;
};

window.b2jsTestJoints = Test;
	
})();