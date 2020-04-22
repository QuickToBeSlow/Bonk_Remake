(function(){

var Test = function() {
	b2jsTest.__constructor.apply(this, arguments);
};
extend(Test.prototype, b2jsTest.prototype)

Test.prototype.createWorld = function() {
	var world = b2jsTest.prototype.createWorld.apply(this, arguments);
	world.DestroyBody(this._wallTop);
	var boxsize = 1.4;
	function spawn(x, y, a) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.Set(x, y);
		bodyDef.angle = a;
		var body = world.CreateBody(bodyDef);
		body.w = boxsize;
		body.h = boxsize;
		var shape = new b2PolygonShape.AsBox(body.w, body.h);
		var fixtureDef = new b2FixtureDef();
		fixtureDef.restitution = 0.0;
		fixtureDef.density = 2.0;
		fixtureDef.friction = 0.9;
		fixtureDef.shape = shape;
		body.CreateFixture(fixtureDef);
		return body;
	}

	for(var i = 0; i < 100; i ++) {
		spawn(32 + Math.sin(i/5) * (6 * boxsize), 32 + i * (2.8 * boxsize), 0);
	}
	
	return world;
};

window.b2jsTestFallingBoxes = Test;
	
})();