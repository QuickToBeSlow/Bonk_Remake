(function(){

var ctx = document.getElementById("canvas");
console.log(ctx);

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
	bd.fixedRotation = true;
	//bd.isBullet = true;
	var b;
	fd.density = 1.0;
	fd.friction = 0.0;
	fd.restitution = 0.1;
	fd.shape = sd;
	var i;
	// Create 3 stacks
	// for (i = 0; i < 10; i++){
	// 	sd.SetAsBox((10) / m_physScale, (10) / m_physScale);
	// 	bd.position.Set((640/2+0+Math.random()*2 - 1) / m_physScale, (360-5-i*25) / m_physScale);
	// 	b = world.CreateBody(bd);
	// 	b.CreateFixture(fd);
	// }
	// for (i = 0; i < 10; i++){
	// 	sd.SetAsBox((10) / m_physScale, (10) / m_physScale);
	// 	bd.position.Set((640/2+100+Math.random()*1 - 0.5) / m_physScale, (360-5-i*25) / m_physScale);
	// 	b = world.CreateBody(bd);
	// 	b.CreateFixture(fd);
	// }
	// for (i = 0; i < 10; i++){
	// 	sd.SetAsBox((10) / m_physScale, (10) / m_physScale);
	// 	bd.position.Set((640/2+200+Math.random()*0.5 - 0.25) / m_physScale, (360-5-i*25) / m_physScale);
	// 	b = world.CreateBody(bd);
	// 	b.CreateFixture(fd);
	// }
	// Create ramp

	// var vxs = [
	// 	new b2Vec2(100 / m_physScale, 0),
	// 	new b2Vec2(100 / m_physScale, 100 / m_physScale),
	// 	new b2Vec2(500 / m_physScale, 100 / m_physScale),
	// 	new b2Vec2(500 / m_physScale, 0 / m_physScale)
	// ];
	sd.SetAsBox((200) / m_physScale, (10) / m_physScale);
	fd.density = 0;
	bd.type = b2Body.b2_staticBody;
	bd.userData = "Floor";
	// bd.userData = "ramp";
	bd.position.Set((300) / m_physScale, (50) / m_physScale);
	b = world.CreateBody(bd);
	b.CreateFixture(fd);

	// Create ball
	var P1 = new b2CircleShape();
	P1.m_radius = 15/m_physScale;
	fd.density = 1;
	fd.restitution = 0.8;
	fd.friction = 0.0;
	fd.shape = P1;
	bd.type = b2Body.b2_dynamicBody;
	bd.userData = "Player1";
	bd.isBullet = true;
	bd.position.Set(200/m_physScale, 140 / m_physScale);
	window.Player1 = world.CreateBody(bd);
	window.PFixture1 = window.Player1.CreateFixture(fd);

	var P2 = new b2CircleShape();
	P2.m_radius = 15/m_physScale;
	bd.position.Set(400/m_physScale, 140 / m_physScale);
	bd.userData = "Player2";
	window.Player2 = world.CreateBody(bd);
	window.PFixture2 = window.Player2.CreateFixture(fd);
	// console.log(Player2);

	return world;
};

window.b2jsTestStack = Test;
	
})();