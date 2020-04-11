(function(){

var Test = function() {
	b2jsTest.__constructor.apply(this, arguments);
};
extend(Test.prototype, b2jsTest.prototype)

Test.prototype.createWorld = function() {
	var world = b2jsTest.prototype.createWorld.apply(this, arguments);
	var m_physScale = 10;
	
	var ground = world.GetGroundBody();
	var jointDef = new b2RevoluteJointDef();
	var L = 170;
	var spacing = 40;
	for (var i = 0; i < 4; i++) {
		jointDef.localAnchorA.Set((250 + spacing * i) / m_physScale, 1.5 * L / m_physScale);
		jointDef.localAnchorB.Set(0, L / m_physScale);
		jointDef.bodyA = ground;
		jointDef.bodyB = this.createBall(world, (250 + spacing * i) / m_physScale, L / m_physScale);
		world.CreateJoint(jointDef);
	}
	jointDef.localAnchorA.Set((250 - spacing) / m_physScale, 1.5 * L / m_physScale);
	jointDef.localAnchorB.Set(0, L / m_physScale);
	jointDef.bodyA = ground;
	jointDef.bodyB = this.createBall(world, (250 - spacing - 3*L) / m_physScale, L / m_physScale);
	world.CreateJoint(jointDef);
	
	
	return world;
};

window.b2jsTestPendulum = Test;
	
})();