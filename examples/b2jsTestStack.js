(function(){

var Test = function() {
	b2jsTest.__constructor.apply(this, arguments);
};
extend(Test.prototype, b2jsTest.prototype)

Test.prototype.createWorld = function() {
	var world = b2jsTest.prototype.createWorld.apply(this, arguments);
	var m_physScale = 10;
	
	var fd = new b2FixtureDef();
	var sd = new b2PolygonShape();
	var bd = new b2BodyDef();
	bd.type = b2Body.b2_dynamicBody;
	//bd.isBullet = true;
	var b;
	fd.density = 1.0;
	fd.friction = 0.5;
	fd.restitution = 0.1;
	fd.shape = sd;
	var i;
	// Create 3 stacks
	for (i = 0; i < 10; i++){
		sd.SetAsBox((10) / m_physScale, (10) / m_physScale);
		bd.position.Set((640/2+0+Math.random()*2 - 1) / m_physScale, (360-5-i*25) / m_physScale);
		b = world.CreateBody(bd);
		b.CreateFixture(fd);
	}
	for (i = 0; i < 10; i++){
		sd.SetAsBox((10) / m_physScale, (10) / m_physScale);
		bd.position.Set((640/2+100+Math.random()*1 - 0.5) / m_physScale, (360-5-i*25) / m_physScale);
		b = world.CreateBody(bd);
		b.CreateFixture(fd);
	}
	for (i = 0; i < 10; i++){
		sd.SetAsBox((10) / m_physScale, (10) / m_physScale);
		bd.position.Set((640/2+200+Math.random()*0.5 - 0.25) / m_physScale, (360-5-i*25) / m_physScale);
		b = world.CreateBody(bd);
		b.CreateFixture(fd);
	}
	// Create ramp

	var vxs = [new b2Vec2(0, 0),
		
		new b2Vec2(200 / m_physScale, 0),
		new b2Vec2(0, 100 / m_physScale)];
	sd.SetAsArray(vxs, vxs.length);
	fd.density = 0;
	bd.type = b2Body.b2_staticBody;
	bd.userData = "ramp";
	bd.position.Set(0, 0);
	b = world.CreateBody(bd);
	b.CreateFixture(fd);

	// Create ball
	var cd = new b2CircleShape();
	cd.m_radius = 40/m_physScale;
	fd.density = 8;
	fd.restitution = 0.4;
	fd.friction = 0.5;
	fd.shape = cd;
	bd.type = b2Body.b2_dynamicBody;
	bd.userData = "ball";
	bd.position.Set(50/m_physScale, 140 / m_physScale);
	b = world.CreateBody(bd);
	b.CreateFixture(fd);	

	return world;
};

window.b2jsTestStack = Test;
	
})();