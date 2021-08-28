(function(){

var ctx = document.getElementById("canvas");

var Test = function() {
	gameEngine.__constructor.apply(this, arguments);
};
extend(Test.prototype, gameEngine.prototype)

Test.prototype.createWorld = function() {
	var world = gameEngine.prototype.createWorld.apply(this, arguments);
	var m_physScale = 10;
	window.shapes = [];
	var fd = new b2FixtureDef();
	// var fd2 = new b2FixtureDef();
	var sd = new b2PolygonShape();
	var sd2 = new b2PolygonShape();
	var bd = new b2BodyDef();
	bd.type = b2Body.b2_staticBody;
	bd.fixedRotation = true;
	//bd.isBullet = true;
	var b;
	fd.density = 1.0;
	fd.friction = 0.0;
	fd.restitution = 0.8;
	fd.shape = sd;	

	sd.SetAsBox((150) / m_physScale, (10) / m_physScale);
	fd.shape = sd;
	fd.density = 0;
	bd.type = b2Body.b2_staticBody;
	bd.userData = "Floor";
	bd.position.Set((300) / m_physScale, (112) / m_physScale);
	b = world.CreateBody(bd);
	window.FloorFixture = b.CreateFixture(fd);
	window.shapes.push(b.CreateFixture(fd));

	// sd.SetAsBox((75) / m_physScale, (10) / m_physScale);
	// fd.shape = sd;
	// fd.density = 0;
	// bd.type = b2Body.b2_staticBody;
	// bd.userData = "Floor";
	// bd.position.Set((160) / m_physScale, (75) / m_physScale);
	// b = world.CreateBody(bd);
	// b.SetAngle(Math.PI/6);
	// window.FloorFixture = b.CreateFixture(fd);
	// window.shapes.push(b.CreateFixture(fd));

	// sd.SetAsBox((75) / m_physScale, (10) / m_physScale);
	// fd.shape = sd;
	// fd.density = 0;
	// bd.type = b2Body.b2_staticBody;
	// bd.userData = "Floor";
	// bd.position.Set((440) / m_physScale, (75) / m_physScale);
	// b = world.CreateBody(bd);
	// b.SetAngle(-Math.PI/6);
	// window.FloorFixture = b.CreateFixture(fd);
	// window.shapes.push(b.CreateFixture(fd));




	//Random Pos
	let randPos = Math.round(Math.random());
	
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
// 	if (randPos == 0) {
// 		bd.position.Set(225/m_physScale, 120/m_physScale);
// 	} else {
// 		bd.position.Set(375/m_physScale, 120/m_physScale);
// 	}
	bd.position.Set((250)/m_physScale, (150+Math.round(Math.random()*25))/m_physScale);
	// bd.position.Set(275/m_physScale, 120/m_physScale);
	window.Player1 = world.CreateBody(bd);
	window.PFixture1 = window.Player1.CreateFixture(fd);
	// sd2.SetAsBox(5,5, new b2Vec2(0, 0), 0);
	// sd2.m_vertices = [new b2Vec2(-0.2, 0), new b2Vec2(0.2, 0), new b2Vec2(0.2, -1.55), new b2Vec2(-0.2, -1.55)];
	fd.density = 0;
	fd.isSensor = true;
	fd.shape = sd2;
	window.P1Foot = window.Player1.CreateFixture(fd);
	window.P1Foot.SetUserData("Foot1");

	var P2 = new b2CircleShape();
	P2.m_radius = 15/m_physScale;
// 	if (randPos == 1) {
// 		bd.position.Set(225/m_physScale, 120/m_physScale);
// 	} else {
// 		bd.position.Set(375/m_physScale, 120/m_physScale);
// 	}	fd.density = 1;
	fd.restitution = 0.8;
	fd.friction = 0.0;
	fd.isSensor = false;
	fd.shape = P2;
	bd.position.Set((350)/m_physScale, (150+Math.round(Math.random()*25))/m_physScale);
	// bd.position.Set(325/m_physScale, 120/m_physScale);
	bd.userData = "Player2";
	window.Player2 = world.CreateBody(bd);
	window.PFixture2 = window.Player2.CreateFixture(fd);
	// sd2.SetAsBox(5,5, new b2Vec2(0, 0), 0);
	// sd2.m_vertices = [new b2Vec2(-0.2, 0), new b2Vec2(0.2, 0), new b2Vec2(0.2, -1.75), new b2Vec2(-0.2, -1.75)];
	fd.density = 0;
	fd.isSensor = true;
	fd.shape = sd2;
	window.P2Foot = window.Player2.CreateFixture(fd);
	window.P2Foot.SetUserData("Foot2");
	// console.log(Player2);



	return world;
};

window.angledMap = Test;
	
})();
