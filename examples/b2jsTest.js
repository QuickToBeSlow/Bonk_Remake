(function(){

	var Test = function() {
		this.__constructor(arguments);
	}
	
	var supaSpeed =1; //set supaSpeed to 1 when the page is loaded.
	
	Test.__constructor = function(canvas) {
		var that = this;
		this._canvas = canvas;
		this._paused = true;
		this._fps = 200;
		this._dbgDraw = new b2DebugDraw();
		
		this._handleMouseMove = function(e){
			// adapted from cocos2d-js/Director.js
			var o = that._canvas;
			var x = o.offsetLeft - document.documentElement.scrollLeft,
				 y = o.offsetTop - document.documentElement.scrollTop;
	
			while (o = o.offsetParent) {
				x += o.offsetLeft - o.scrollLeft;
				y += o.offsetTop - o.scrollTop;
			}
	
			var p = new b2Vec2(e.clientX - x, e.clientY - y);
	
			that._mousePoint = that._dbgDraw.ToWorldPoint(p);
		};
		this._handleMouseDown = function(e){
			that._mouseDown = true;
		};
		this._handleMouseUp = function(e) {
			that._mouseDown = false;
		};
		this._handleKeyDown = function(e) {
			that._keyDown = e.code;
			// console.log(e);
			// console.log(e.code);
		}
		this._handleKeyUp = function(e) {
			that._keyUp = e.code;
		}
		// see _updateUserInteraction
		canvas.addEventListener("mousemove", this._handleMouseMove, true);
		canvas.addEventListener("mousedown", this._handleMouseDown, true);
		canvas.addEventListener("mouseup", this._handleMouseUp, true);
		document.addEventListener("keydown", this._handleKeyDown, true);
		document.addEventListener("keyup", this._handleKeyUp, true);
		
		this._velocityIterationsPerSecond = 300;
		this._positionIterationsPerSecond = 200;
		
		// sublcasses expect visual area inside 64x36
		this._dbgDraw.m_drawScale = Math.min(canvas.width/64, canvas.height/36);
		this._dbgDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);
		this._world = this.createWorld();
	}
	
	Test.prototype.log = function(arg) {
		if(typeof(window.console) != 'undefined') {
			console.log(arg);
		}
	};
	
	Test.prototype.destroy = function() {
		this.pause();
		
		canvas.removeEventListener("mousemove", this._handleMouseMove, true);
		canvas.removeEventListener("mousedown", this._handleMouseDown, true);
		canvas.removeEventListener("mouseup", this._handleMouseUp, true);
		document.removeEventListener("keydown", this._handleKeyDown, true);
		document.removeEventListener("keyup", this._handleKeyUp, true);
		this._canvas = null;
		this._dbgDraw = null;
		this._world = null;
	}
	
	
	var onPlatform = false;
	var onPlatform2 = false;
	Test.prototype.createWorld = function(){
		var m_world = new b2World(new b2Vec2(0.0, -9.81*3.25), true);
		var m_physScale = 1;
		m_world.SetWarmStarting(true);
		
		// Create border of boxes
		var wall = new b2PolygonShape();
		var wallBd = new b2BodyDef();
		
		// // Left
		// wallBd.position.Set( -9.5 / m_physScale, 36 / m_physScale / 2);
		// wall.SetAsBox(10/m_physScale, 40/m_physScale/2);
		// this._wallLeft = m_world.CreateBody(wallBd);
		// this._wallLeft.CreateFixture2(wall);
		// // Right
		// wallBd.position.Set((64 + 9.5) / m_physScale, 36 / m_physScale / 2);
		// this._wallRight = m_world.CreateBody(wallBd);
		// this._wallRight.CreateFixture2(wall);
		// // Top
		// wallBd.position.Set(64 / m_physScale / 2, (36 + 9.5) / m_physScale);
		// wall.SetAsBox(68/m_physScale/2, 10/m_physScale);
		// this._wallTop = m_world.CreateBody(wallBd);
		// this._wallTop.CreateFixture2(wall);	
		// // Bottom
		// wallBd.position.Set(64 / m_physScale / 2, -9.5 / m_physScale);
		// this._wallBottom = m_world.CreateBody(wallBd);
		// this._wallBottom.CreateFixture2(wall);
		var b2Listener = b2ContactListener;
		//Add listeners for contact
		var listener = new b2Listener;
		listener.BeginContact = function(contact) {
			// console.log(contact.GetFixtureA().GetBody().GetUserData());
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player1') {
				onPlatform = true;
				// console.log(onPlatform);
			}
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player2') {
				onPlatform2 = true;
				// console.log(onPlatform2);
			}
		}
		listener.EndContact = function(contact) {
			// console.log(contact.GetFixtureA().GetBody().GetUserData());
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player1') {
				onPlatform = false;
				// console.log(onPlatform);
			}
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player2') {
				onPlatform2 = false;
				// console.log(onPlatform2);
			}
		}
		listener.PostSolve = function(contact, impulse) {
			
		}
		listener.PreSolve = function(contact, oldManifold) {
	
		}
		m_world.SetContactListener(listener);
		return m_world;
	};
	
	Test.prototype.createBall = function(world, x, y, radius) {
		radius = radius || 2;
		
		var fixtureDef = new b2FixtureDef();
		fixtureDef.shape = new b2CircleShape(radius);
		fixtureDef.friction = 0.4;
		fixtureDef.restitution = 0.6;
		fixtureDef.density = 1.0;
		
		var ballBd = new b2BodyDef();
		ballBd.type = b2Body.b2_dynamicBody;
		ballBd.position.Set(x,y);
		var body = world.CreateBody(ballBd);
		body.CreateFixture(fixtureDef);
		return body;
	}
	
	Test.prototype.draw = function() {
		var c = this._canvas.getContext("2d");
		
		this._dbgDraw.SetSprite(c);
		if(this._world) {
			this._world.SetDebugDraw(this._dbgDraw);
			this._world.DrawDebugData();
		}

		c.fillStyle = "black";
		if(this._paused) {
			c.fillText("paused", 5, 15);
			c.fillText("speed:" + supaSpeed,5, 30);
		} else {
			c.fillText("FPS: " + this._fpsAchieved, 5, 15);
			c.fillText("speed:" + supaSpeed,5, 30);
		}
		if (window.heavy) {
			c.strokeStyle = "rgb("+(127*(strengths[0]/maxStrengths[0])+127)+","+(127*(strengths[0]/maxStrengths[0])+127)+","+(127*(strengths[0]/maxStrengths[0])+127)+")";
			// c.strokeStyle = "rgb(255,255,255)";
			c.beginPath();
			c.lineWidth = 3;
			c.arc(window.Player1.GetPosition().x*12.5,-window.Player1.GetPosition().y*12.5+this._canvas.height,20,0,2*Math.PI);
			c.stroke();
			c.strokeStyle = "rgb(0,0,0)";
		}
	}
	
	var maxStrengths = [5,5];		//array of player heavy-mass.
	var strengths = maxStrengths;//copy the maxStrengths array.
	var decay = 0.01; 					//constant
	var regrowth = 0.02; 				//constant
	var slowDown = false;
	
	Test.prototype.step = function(delta) {
		var delta = (typeof delta == "undefined") ? 1/this._fps : delta;
		for (i = 0; i < supaSpeed; i++) { // a for loop that iterates the this._world.Step() function "supaSpeed" amount of times before each render.

			if(!this._world)
				return;
			this._world.ClearForces();
			// console.log(this._world.GetContactList());
			// console.log(window.Player1.GetMass());
			if (window.heavy[0]) {
				// slowDown = true;
				window.PFixture1.SetDensity(strengths[0]);
				// console.log(PFixture1);
				window.Player1.ResetMassData();
				if (strength[0]>1) {
					strengths[0]-=decay;
				} else {
					strengths[0] = 1;
				}
			} else {
				// slowDown = false;
				window.PFixture1.SetDensity(1);
				window.Player1.ResetMassData();
				if (strengths[0]<maxStrength[0]) {
					strengths[0]+=regrowth;
				} else {
					strengths[0] = maxStrength[0];
				}
			}
			if (window.up[0]) {
				if (onPlatform && window.Player1.GetLinearVelocity().y < 4) {
					window.Player1.ApplyForce(new b2Vec2(0, 20000), window.Player1.GetPosition());
				}
				window.Player1.ApplyForce(new b2Vec2(0, speed), window.Player1.GetPosition());
			}
			if (window.down[0]) {
				window.Player1.ApplyForce(new b2Vec2(0, -speed), window.Player1.GetPosition());
			}
			if (window.left[0]) {
				window.Player1.ApplyForce(new b2Vec2(-speed, 0), window.Player1.GetPosition());
			}
			if (window.right[0]) {
				window.Player1.ApplyForce(new b2Vec2(speed, 0), window.Player1.GetPosition());
			}
					
			//this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);
		
			this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);
		}
	}
	
	Test.prototype.supaSpeedUp = function () {
		supaSpeed*=2; //increase iterations
	}
	
	Test.prototype.supaSpeedDown = function () {
		if (supaSpeed>1) { //decrease iterations only if it's over 1, we don't want this._world.Step() to never get called...
			supaSpeed/=2;
		}
	}
	
	window.scores = [0,0];
	Test.prototype.endGame = function (winner) {
		window.scores[winner-1]++;
	}
	
	Test.prototype._updateMouseInteraction = function() {
		// To Do: re-factor into world helper or similar
		function getBodyAtPoint(world, p) {
			var aabb = new b2AABB();
			aabb.lowerBound.Set(p.x - 0.001, p.y - 0.001);
			aabb.upperBound.Set(p.x + 0.001, p.y + 0.001);
	
			var selectedBody = null;
			world.QueryAABB(function(fixture){
				if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
					if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), p)) {
						selectedBody = fixture.GetBody();
						return false;
					}
				}
				return true;
				}, aabb);
				return selectedBody;
		}
	
		if(!this._mousePoint)
			return;
	
		if(this._mouseDown && (!this._mouseJoint)) {
			var body = getBodyAtPoint(this._world, this._mousePoint);
			if(body) {
				var md = new b2MouseJointDef();
				md.bodyA = this._world.GetGroundBody();
				md.bodyB = body;
				md.target = this._mousePoint;
				md.collideConnected = true;
				md.maxForce = 300.0 * body.GetMass();
				this._mouseJoint = this._world.CreateJoint(md);
				body.SetAwake(true);
			}
		}
	
		if(this._mouseJoint) {
			if(this._mouseDown) {
				this._mouseJoint.SetTarget(this._mousePoint);
			} else {
				this._world.DestroyJoint(this._mouseJoint);
				this._mouseJoint = undefined;
			}
		}	
	}
	
	var speed = 135;
	window.up = [false,false];
	window.down = [false,false];
	window.left = [false,false];
	window.right = [false,false];
	window.heavy = [false,false];
	Test.prototype._updateKeyboardInteraction = function() {
		// TBD

		if (this._keyDown != undefined) {
			if (this._keyDown == "KeyW") {
				window.up[0] = true;
			} else if (this._keyDown == "KeyA") {
				window.left[0] = true;
			} else if (this._keyDown == "KeyS") {
				window.down[0] = true;
			} else if (this._keyDown == "KeyD") {
				window.right[0] = true;
			} else if (this._keyDown == "Space") {
				window.heavy[0] = true;
			}
		}
		if (this._keyUp != undefined) {
			if (this._keyUp == "KeyW") {
				window.up[0] = false;
			} else if (this._keyUp == "KeyA") {
				window.left[0] = false;
			} else if (this._keyUp == "KeyS") {
				window.down[0] = false;
			} else if (this._keyUp == "KeyD") {
				window.right[0] = false;
			} else if (this._keyUp == "Space") {
				window.heavy[0] = false;
			}
		}
			this._keyDown = undefined;
			this._keyUp = undefined;
	}
	
	Test.prototype._updateUserInteraction = function() {
		this._updateMouseInteraction();
		this._updateKeyboardInteraction();
		
		if(!this._paused) {
			var that = this;
			this._updateUserInteractionTimout = window.setTimeout(function(){that._updateUserInteraction()}, 1000/20);
		}
	}
	
	Test.prototype._update = function() {
		// derive passed time since last update. max. 10 secs
		var time = new Date().getTime();
		delta = (time - this._lastUpdate) / 1000;
		this._lastUpdate = time;
		if(delta > 10)
			delta = 1/this._fps;
			
		// see this._updateFPS
		this._fpsCounter++;
		
		this.step(delta);
		this.draw();
		if(!this._paused) {
			var that = this;
			this._updateTimeout = window.setTimeout(function(){that._update()});
		}
	}
	
	Test.prototype._updateFPS = function() {
		this._fpsAchieved = this._fpsCounter;
		// this.log("fps: " + this._fpsAchieved);
		this._fpsCounter = 0;
		
		if(!this._paused) {
			var that = this;
			this._updateFPSTimeout = window.setTimeout(function(){that._updateFPS()}, 1000);
		}
	}
	
	Test.prototype.resume = function() {
		if(this._paused) {
			this._paused = false;
			this._lastUpdate = 0;
			this._update();
			this._updateFPS();
			this._updateUserInteraction();
		}
	}
	
	Test.prototype.pause = function() {
		this._paused = true;
		window.clearTimeout(this._updateTimeout);
		window.clearTimeout(this._updateFPSTimeout);
		window.clearTimeout(this._updateUserInteractionTimout);
	}
	
	Test.prototype.isPaused = function() {
		return this._paused;
	}
	
	window.b2jsTest = Test;
		
	})();(function(){

	var Test = function() {
		this.__constructor(arguments);
	}
	
	var supaSpeed =1; //set supaSpeed to 1 when the page is loaded.
	
	Test.__constructor = function(canvas) {
		var that = this;
		this._canvas = canvas;
		this._paused = true;
		this._fps = 200;
		this._dbgDraw = new b2DebugDraw();
		
		this._handleMouseMove = function(e){
			// adapted from cocos2d-js/Director.js
			var o = that._canvas;
			var x = o.offsetLeft - document.documentElement.scrollLeft,
				 y = o.offsetTop - document.documentElement.scrollTop;
	
			while (o = o.offsetParent) {
				x += o.offsetLeft - o.scrollLeft;
				y += o.offsetTop - o.scrollTop;
			}
	
			var p = new b2Vec2(e.clientX - x, e.clientY - y);
	
			that._mousePoint = that._dbgDraw.ToWorldPoint(p);
		};
		this._handleMouseDown = function(e){
			that._mouseDown = true;
		};
		this._handleMouseUp = function(e) {
			that._mouseDown = false;
		};
		this._handleKeyDown = function(e) {
			that._keyDown = e.code;
			// console.log(e);
			// console.log(e.code);
		}
		this._handleKeyUp = function(e) {
			that._keyUp = e.code;
		}
		// see _updateUserInteraction
		canvas.addEventListener("mousemove", this._handleMouseMove, true);
		canvas.addEventListener("mousedown", this._handleMouseDown, true);
		canvas.addEventListener("mouseup", this._handleMouseUp, true);
		document.addEventListener("keydown", this._handleKeyDown, true);
		document.addEventListener("keyup", this._handleKeyUp, true);
		
		this._velocityIterationsPerSecond = 300;
		this._positionIterationsPerSecond = 200;
		
		// sublcasses expect visual area inside 64x36
		this._dbgDraw.m_drawScale = Math.min(canvas.width/64, canvas.height/36);
		this._dbgDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);
		this._world = this.createWorld();
	}
	
	Test.prototype.log = function(arg) {
		if(typeof(window.console) != 'undefined') {
			console.log(arg);
		}
	};
	
	Test.prototype.destroy = function() {
		this.pause();
		
		canvas.removeEventListener("mousemove", this._handleMouseMove, true);
		canvas.removeEventListener("mousedown", this._handleMouseDown, true);
		canvas.removeEventListener("mouseup", this._handleMouseUp, true);
		document.removeEventListener("keydown", this._handleKeyDown, true);
		document.removeEventListener("keyup", this._handleKeyUp, true);
		this._canvas = null;
		this._dbgDraw = null;
		this._world = null;
	}
	
	
	var onPlatform = [false,false];
	Test.prototype.createWorld = function(){
		var m_world = new b2World(new b2Vec2(0.0, -9.81*3.25), true);
		var m_physScale = 1;
		m_world.SetWarmStarting(true);
		
		// Create border of boxes
		var wall = new b2PolygonShape();
		var wallBd = new b2BodyDef();
		
		// // Left
		// wallBd.position.Set( -9.5 / m_physScale, 36 / m_physScale / 2);
		// wall.SetAsBox(10/m_physScale, 40/m_physScale/2);
		// this._wallLeft = m_world.CreateBody(wallBd);
		// this._wallLeft.CreateFixture2(wall);
		// // Right
		// wallBd.position.Set((64 + 9.5) / m_physScale, 36 / m_physScale / 2);
		// this._wallRight = m_world.CreateBody(wallBd);
		// this._wallRight.CreateFixture2(wall);
		// // Top
		// wallBd.position.Set(64 / m_physScale / 2, (36 + 9.5) / m_physScale);
		// wall.SetAsBox(68/m_physScale/2, 10/m_physScale);
		// this._wallTop = m_world.CreateBody(wallBd);
		// this._wallTop.CreateFixture2(wall);	
		// // Bottom
		// wallBd.position.Set(64 / m_physScale / 2, -9.5 / m_physScale);
		// this._wallBottom = m_world.CreateBody(wallBd);
		// this._wallBottom.CreateFixture2(wall);
		var b2Listener = b2ContactListener;
		//Add listeners for contact
		var listener = new b2Listener;
		listener.BeginContact = function(contact) {
			// console.log(contact.GetFixtureA().GetBody().GetUserData());
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player1') {
				onPlatform[0] = true;
				// console.log(onPlatform);
			}
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player2') {
				onPlatform[1]= true;
				// console.log(onPlatform2);
			}
		}
		listener.EndContact = function(contact) {
			// console.log(contact.GetFixtureA().GetBody().GetUserData());
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player1') {
				onPlatform[0] = false;
				// console.log(onPlatform);
			}
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player2') {
				onPlatform[1] = false;
				// console.log(onPlatform2);
			}
		}
		listener.PostSolve = function(contact, impulse) {
			
		}
		listener.PreSolve = function(contact, oldManifold) {
	
		}
		m_world.SetContactListener(listener);
		return m_world;
	};
	
	Test.prototype.createBall = function(world, x, y, radius) {
		radius = radius || 2;
		
		var fixtureDef = new b2FixtureDef();
		fixtureDef.shape = new b2CircleShape(radius);
		fixtureDef.friction = 0.4;
		fixtureDef.restitution = 0.6;
		fixtureDef.density = 1.0;
		
		var ballBd = new b2BodyDef();
		ballBd.type = b2Body.b2_dynamicBody;
		ballBd.position.Set(x,y);
		var body = world.CreateBody(ballBd);
		body.CreateFixture(fixtureDef);
		return body;
	}
	
	Test.prototype.draw = function() {
		var c = this._canvas.getContext("2d");
		
		this._dbgDraw.SetSprite(c);
		if(this._world) {
			this._world.SetDebugDraw(this._dbgDraw);
			this._world.DrawDebugData();
		}

		c.fillStyle = "black";
		if(this._paused) {
			c.fillText("paused", 5, 15);
			c.fillText("speed:" + supaSpeed,5, 30);
		} else {
			c.fillText("FPS: " + this._fpsAchieved, 5, 15);
			c.fillText("speed:" + supaSpeed,5, 30);
		}
		if (window.heavy) {
			c.strokeStyle = "rgb("+(127*(strengths[0]/maxStrengths[0])+127)+","+(127*(strengths[0]/maxStrengths[0])+127)+","+(127*(strengths[0]/maxStrengths[0])+127)+")";
			// c.strokeStyle = "rgb(255,255,255)";
			c.beginPath();
			c.lineWidth = 3;
			c.arc(window.Player1.GetPosition().x*12.5,-window.Player1.GetPosition().y*12.5+this._canvas.height,20,0,2*Math.PI);
			c.stroke();
			c.strokeStyle = "rgb(0,0,0)";
		}
	}
	
	var maxStrengths = [5,5];		//array of player heavy-mass.
	var strengths = maxStrengths;//copy the maxStrengths array.
	var decay = 0.01; 					//constant
	var regrowth = 0.02; 				//constant
	var slowDown = false;
	
	Test.prototype.step = function(delta) {
		var delta = (typeof delta == "undefined") ? 1/this._fps : delta;
		for (i = 0; i < supaSpeed; i++) { // a for loop that iterates the this._world.Step() function "supaSpeed" amount of times before each render.

			if(!this._world)
				return;
			this._world.ClearForces();
			// console.log(this._world.GetContactList());
			// console.log(window.Player1.GetMass());
			if (window.heavy[0]) {
				// slowDown = true;
				window.PFixture1.SetDensity(strengths[0]);
				// console.log(PFixture1);
				window.Player1.ResetMassData();
				if (strength[0]>1) {
					strengths[0]-=decay;
				} else {
					strengths[0] = 1;
				}
			} else {
				// slowDown = false;
				window.PFixture1.SetDensity(1);
				window.Player1.ResetMassData();
				if (strengths[0]<maxStrength[0]) {
					strengths[0]+=regrowth;
				} else {
					strengths[0] = maxStrength[0];
				}
			}
			if (window.up[0]) {
				if (onPlatform && window.Player1.GetLinearVelocity().y < 4) {
					window.Player1.ApplyForce(new b2Vec2(0, 20000), window.Player1.GetPosition());
				}
				window.Player1.ApplyForce(new b2Vec2(0, speed), window.Player1.GetPosition());
			}
			if (window.down[0]) {
				window.Player1.ApplyForce(new b2Vec2(0, -speed), window.Player1.GetPosition());
			}
			if (window.left[0]) {
				window.Player1.ApplyForce(new b2Vec2(-speed, 0), window.Player1.GetPosition());
			}
			if (window.right[0]) {
				window.Player1.ApplyForce(new b2Vec2(speed, 0), window.Player1.GetPosition());
			}
					
			//this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);
		
			this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);
		}
	}
	
	Test.prototype.supaSpeedUp = function () {
		supaSpeed*=2; //increase iterations
	}
	
	Test.prototype.supaSpeedDown = function () {
		if (supaSpeed>1) { //decrease iterations only if it's over 1, we don't want this._world.Step() to never get called...
			supaSpeed/=2;
		}
	}
	
	window.scores = [0,0];
	Test.prototype.endGame = function (winner) {
		window.scores[winner-1]++;
	}
	
	Test.prototype._updateMouseInteraction = function() {
		// To Do: re-factor into world helper or similar
		function getBodyAtPoint(world, p) {
			var aabb = new b2AABB();
			aabb.lowerBound.Set(p.x - 0.001, p.y - 0.001);
			aabb.upperBound.Set(p.x + 0.001, p.y + 0.001);
	
			var selectedBody = null;
			world.QueryAABB(function(fixture){
				if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
					if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), p)) {
						selectedBody = fixture.GetBody();
						return false;
					}
				}
				return true;
				}, aabb);
				return selectedBody;
		}
	
		if(!this._mousePoint)
			return;
	
		if(this._mouseDown && (!this._mouseJoint)) {
			var body = getBodyAtPoint(this._world, this._mousePoint);
			if(body) {
				var md = new b2MouseJointDef();
				md.bodyA = this._world.GetGroundBody();
				md.bodyB = body;
				md.target = this._mousePoint;
				md.collideConnected = true;
				md.maxForce = 300.0 * body.GetMass();
				this._mouseJoint = this._world.CreateJoint(md);
				body.SetAwake(true);
			}
		}
	
		if(this._mouseJoint) {
			if(this._mouseDown) {
				this._mouseJoint.SetTarget(this._mousePoint);
			} else {
				this._world.DestroyJoint(this._mouseJoint);
				this._mouseJoint = undefined;
			}
		}	
	}
	
	var speed = 135;
	window.up = [false,false];
	window.down = [false,false];
	window.left = [false,false];
	window.right = [false,false];
	window.heavy = [false,false];
	Test.prototype._updateKeyboardInteraction = function() {
		// TBD

		if (this._keyDown != undefined) {
			if (this._keyDown == "KeyW") {
				window.up[0] = true;
			} else if (this._keyDown == "KeyA") {
				window.left[0] = true;
			} else if (this._keyDown == "KeyS") {
				window.down[0] = true;
			} else if (this._keyDown == "KeyD") {
				window.right[0] = true;
			} else if (this._keyDown == "Space") {
				window.heavy[0] = true;
			}
		}
		if (this._keyUp != undefined) {
			if (this._keyUp == "KeyW") {
				window.up[0] = false;
			} else if (this._keyUp == "KeyA") {
				window.left[0] = false;
			} else if (this._keyUp == "KeyS") {
				window.down[0] = false;
			} else if (this._keyUp == "KeyD") {
				window.right[0] = false;
			} else if (this._keyUp == "Space") {
				window.heavy[0] = false;
			}
		}
			this._keyDown = undefined;
			this._keyUp = undefined;
	}
	
	Test.prototype._updateUserInteraction = function() {
		this._updateMouseInteraction();
		this._updateKeyboardInteraction();
		
		if(!this._paused) {
			var that = this;
			this._updateUserInteractionTimout = window.setTimeout(function(){that._updateUserInteraction()}, 1000/20);
		}
	}
	
	Test.prototype._update = function() {
		// derive passed time since last update. max. 10 secs
		var time = new Date().getTime();
		delta = (time - this._lastUpdate) / 1000;
		this._lastUpdate = time;
		if(delta > 10)
			delta = 1/this._fps;
			
		// see this._updateFPS
		this._fpsCounter++;
		
		this.step(delta);
		this.draw();
		if(!this._paused) {
			var that = this;
			this._updateTimeout = window.setTimeout(function(){that._update()});
		}
	}
	
	Test.prototype._updateFPS = function() {
		this._fpsAchieved = this._fpsCounter;
		// this.log("fps: " + this._fpsAchieved);
		this._fpsCounter = 0;
		
		if(!this._paused) {
			var that = this;
			this._updateFPSTimeout = window.setTimeout(function(){that._updateFPS()}, 1000);
		}
	}
	
	Test.prototype.resume = function() {
		if(this._paused) {
			this._paused = false;
			this._lastUpdate = 0;
			this._update();
			this._updateFPS();
			this._updateUserInteraction();
		}
	}
	
	Test.prototype.pause = function() {
		this._paused = true;
		window.clearTimeout(this._updateTimeout);
		window.clearTimeout(this._updateFPSTimeout);
		window.clearTimeout(this._updateUserInteractionTimout);
	}
	
	Test.prototype.isPaused = function() {
		return this._paused;
	}
	
	window.b2jsTest = Test;
		
	})();