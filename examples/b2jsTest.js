(function(){

var Test = function() {
	this.__constructor(arguments);
}

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
Test.prototype.createWorld = function(){
	var m_world = new b2World(new b2Vec2(0.0, -9.81*3), true);
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
	// console.log(b2ContactListener);
	//Add listeners for contact
	var listener = new b2Listener;
    listener.BeginContact = function(contact) {
        console.log(contact.GetFixtureA().GetBody().GetUserData());
        if (contact.GetFixtureB().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player1') {
			onPlatform = true;
		}
    }
    listener.EndContact = function(contact) {
		// console.log(contact.GetFixtureA().GetBody().GetUserData());
        if (contact.GetFixtureB().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player1') {
			onPlatform = false;
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
	} else {
		c.fillText("FPS: " + this._fpsAchieved, 5, 15);
	}
}

Test.prototype.step = function(delta) {
	if(!this._world)
		return;
		
	this._world.ClearForces();
	// console.log(this._world.GetContactList());
	// console.log(window.Player1);
	if (window.up) {
		window.Player1.ApplyForce(new b2Vec2(0, speed), window.Player1.GetPosition());
	}
	if (window.down) {
		window.Player1.ApplyForce(new b2Vec2(0, -speed), window.Player1.GetPosition());
	}
	if (window.left) {
		window.Player1.ApplyForce(new b2Vec2(-speed, 0), window.Player1.GetPosition());
	}
	if (window.right) {
		window.Player1.ApplyForce(new b2Vec2(speed, 0), window.Player1.GetPosition());
	}

	var delta = (typeof delta == "undefined") ? 1/this._fps : delta;
	
	this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);	
}

Test.prototype._updateMouseInteraction = function() {
	// todo: refactor into world helper or similar
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
var speed = 150;
window.up = false;
window.down = false;
window.left = false;
window.right = false;
Test.prototype._updateKeyboardInteraction = function() {
	// TBD
	// console.log(this._keyDown);
	if (this._keyDown != undefined) {
	// console.log("pressed");
	// console.log(this._keyDown);
		if (this._keyDown == "KeyW") {
			window.up = true;
		} else if (this._keyDown == "KeyA") {
			window.left = true;
		} else if (this._keyDown == "KeyS") {
			window.down = true;
		} else if (this._keyDown == "KeyD") {
			window.right = true;
		}
	}
	if (this._keyUp != undefined) {
		if (this._keyUp == "KeyW") {
			window.up = false;
		} else if (this._keyUp == "KeyA") {
			window.left = false;
		} else if (this._keyUp == "KeyS") {
			window.down = false;
		} else if (this._keyUp == "KeyD") {
			window.right = false;
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