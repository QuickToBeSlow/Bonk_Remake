(function(){

	//code for raycasting
	
	var rayCastInput = new b2RayCastInput();
	var rayCastOutput =  new b2RayCastOutput();
	var m_physScale = 10;
	// console.log(rayCastInput);

	function raycast(b2Fixture, p1, p2, maxFraction){
	  rayCastInput.p1 = p1;
	  rayCastInput.p2 = p2;
	  rayCastInput.maxFraction = 1;
	  let closestShape;
	//   console.log(rayCastInput);
	for (let m=0; m<shapes.length; m++) {
	  if(window.shapes[m].RayCast(rayCastOutput, rayCastInput)){
		if (rayCastOutput.fraction < rayCastInput.maxFraction && rayCastOutput.fraction >= 0) {
			closestShape = window.shapes[m];
			rayCastInput.maxFraction = rayCastOutput.fraction;
			// return {
			// 	normal: rayCastOutput.normal,
			// 	fraction: rayCastOutput.fraction,
			// 	distance: rayCastOutput.fraction*Math.sqrt(Math.pow(rayCastInput.p1.x-rayCastInput.p2.x, 2)+Math.pow(rayCastInput.p1.y-rayCastInput.p2.y, 2))
			// }
		}
	  }
	}
	if(closestShape != undefined && closestShape.RayCast(rayCastOutput, rayCastInput)){
		// if ((1-rayCastOutput.fraction)*Math.sqrt(Math.pow(rayCastInput.p1.x-rayCastInput.p2.x, 2)+Math.pow(rayCastInput.p1.y-rayCastInput.p2.y, 2)) < 0) {
		// 	console.log("error!");
		// }
		return {
			normal: rayCastOutput.normal,
			fraction: rayCastOutput.fraction,
			distance: (rayCastOutput.fraction)*Math.sqrt(Math.pow(rayCastInput.p1.x-rayCastInput.p2.x, 2)+Math.pow(rayCastInput.p1.y-rayCastInput.p2.y, 2))
		}
	}
	  return false;
	}

	//code for Gaussian
	
	
	function sigmoid(value) {
		return 2*(Math.pow(Math.E, value)/(1+Math.pow(Math.E, value)))-1;
	}

	window.eyes = 8;
	window.debug = false;
	window.draw = true;
	var controlPlayer1 = true;
	var round = 0;
	var roundCap = 15;
	var leadTolerance = 9;
	var currentNN = 0;
	var TOTAL = 512;
	var NNs = [];
	var savedNNs = [];
	var winnerList = [];
	window.saveTourneyWinner = false;
	window.saveRedNN = false;
	window.saveBlueNN = false;
	var secondBest;
	window.testingMode = false;
	window.testingChange = false;
	window.winner = undefined;
	window.prevWinner = undefined;
	
	for (let j=0; j<TOTAL; j++) {
		winnerList.push(j);
	}
	var reward = 0;
	var reward2 = 0;
	var supaSpeed = 1; //set supaSpeed to 1 when the page is loaded.
	var canColReward = true;
	var hasCollided = false;
	var generation = 0;
	
	class NN {
		constructor(brain) {
		  this.score = 0;
		  this.fitness = 0;
		  if (brain) {
			this.brain = brain.copy();
		  } else {
		      this.brain = new NeuralNetwork(7+(window.eyes*2), [Math.round((7+window.eyes*2)*0.75),Math.round((7+window.eyes*2)*0.75), Math.round((7+window.eyes*2)*0.75)],3);
		  }
		}
	  
		dispose() {
		  this.brain.dispose();
		}
	
		mutate() {
		  this.brain.mutate(1); //100% chance of a mutation occuring for each weight.
		}
	  
		think(i) {
			let inputs = [];
			var p1 = { x: window.Player1.GetPosition().x , y: window.Player1.GetPosition().y };
			var p2 = { x: window.Player2.GetPosition().x , y: window.Player2.GetPosition().y };
			
			// angle in degrees.
			var p1AngleDeg = Math.abs(Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI);
			var p2AngleDeg = Math.abs(Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180 / Math.PI);
			var p1Deg = Math.abs(Math.atan2(window.Player1.GetLinearVelocity().y,window.Player1.GetLinearVelocity().x) * 180 / Math.PI);
			var p2Deg = Math.abs(Math.atan2(window.Player2.GetLinearVelocity().y,window.Player2.GetLinearVelocity().x) * 180 / Math.PI);
			var p1Speed = Math.sqrt(Math.pow(Math.abs(window.Player1.GetLinearVelocity().x),2)+Math.pow(Math.abs(window.Player1.GetLinearVelocity().y),2));
			var p2Speed = Math.sqrt(Math.pow(Math.abs(window.Player2.GetLinearVelocity().x),2)+Math.pow(Math.abs(window.Player2.GetLinearVelocity().y),2));
			
			if (i==0) {

				inputs[0] = (window.Player1.GetPosition().y > window.Player2.GetPosition().y)*10-5;
				inputs[1] = playerDistance/25; //distance from eachother
				inputs[2] = p1Speed; //my speed
				inputs[3] = p2Speed; //opponent's speed
				inputs[4] = p1Deg; //my current absolute direction
				inputs[5] = p2Deg; //opponent's current absolute direction
				inputs[6] = p1AngleDeg; //absolute direction from me to opponent

				let PPosX = window.Player1.GetPosition().x;
				let PPosY = window.Player1.GetPosition().y;
				let change = 360/(window.eyes*2);
				for (let l=0; l<(window.eyes)*2; l++) {
					inputs[7+l] = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((l*change)/180*Math.PI)*75), PPosY-(Math.sin((l*change)/180*Math.PI)*75))).distance || -1;
				}
			} else {

				inputs[0] = (window.Player2.GetPosition().y > window.Player1.GetPosition().y)*10-5;
				inputs[1] = playerDistance/25; //distance from eachother
				inputs[2] = p2Speed; //my speed
				inputs[3] = p1Speed; //opponent's speed
				inputs[4] = p2Deg; //my current absolute direction
				inputs[5] = p1Deg; //opponent's current absolute direction
				inputs[6] = p2AngleDeg; //absolute direction from me to opponent

				let PPosX = window.Player2.GetPosition().x;
				let PPosY = window.Player2.GetPosition().y;
				let change = 360/(window.eyes*2);
				for (let l=0; l<(window.eyes)*2; l++) {
					inputs[7+l] = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((l*change)/180*Math.PI)*75), PPosY-(Math.sin((l*change)/180*Math.PI)*75))).distance || -1;
				}
			}
	
			let output = this.brain.predict(inputs);
		  if (output[0] < (1/2)) {
				window.down[i] = true;
			} else if (output[0] > (1/2)) {
				window.up[i] = true;
			}
		  if (output[1] < (1/2)) {
				window.left[i] = true;
			} else if (output[1] > (1/2)) {
				window.right[i] = true;
			}
		  if (0.5 < output[2]) {
				window.heavy[i] = true;
			}
		}	  
	  }
	  class NeuralNetwork {
		constructor(a, b, c, d) {
		  if (a instanceof tf.Sequential) {
			this.model = a;
			this.input_nodes = b;
			this.hidden_nodes = c;
			this.output_nodes = d;
		  } else {
			this.input_nodes = a;
			this.hidden_nodes = b;
			this.output_nodes = c;
			this.model = this.createModel();
		  }
		}
	  
		copy() {
		  return tf.tidy(() => {
			const modelCopy = this.createModel();
			const weights = this.model.getWeights();
			const weightCopies = [];
			for (let i = 0; i < weights.length; i++) {
			  weightCopies[i] = weights[i].clone();
			}
			modelCopy.setWeights(weightCopies);
			return new NeuralNetwork(modelCopy,this.input_nodes,this.hidden_nodes,this.output_nodes);
		  });
		}
	  
		mutate(rate) {
		  tf.tidy(() => {
			const weights = this.model.getWeights();
			const mutatedWeights = [];
			for (let i = 0; i < weights.length; i++) {
			  let tensor = weights[i];
			  let shape = weights[i].shape;
			  let values = tensor.dataSync().slice();
			  for (let j = 0; j < values.length; j++) {

				if (Math.random() < rate) {
					let w = values[j];
					var test = w + Math.random()/100-0.005;
					if( test > -5 && test < 5) {
						values[j] = test;		
					} else {
						values[j] = w;
					}
				}

			  }
			  let newTensor = tf.tensor(values, shape);
			  mutatedWeights[i] = newTensor;
			}
			this.model.setWeights(mutatedWeights);
		  });
		}
	  
		dispose() {
		  this.model.dispose();
		}
	  
		predict(inputs) {
		  return tf.tidy(() => {
			const xs = tf.tensor2d([inputs]);
			const ys = this.model.predict(xs);
			const outputs = ys.dataSync();
			// console.log(outputs);
			return outputs;
		  });
		}
	
		createModel() {
			const model = tf.sequential();
			for (let i=0; i<this.hidden_nodes.length; i++) {
				if (i==0) {
					let hidden = tf.layers.dense({
						units: this.hidden_nodes[i],
						inputShape: [this.input_nodes],
						activation: 'selu'
					});
					model.add(hidden);
				} else if (i%2 == 0) {
					let hidden = tf.layers.dense({
						units: this.hidden_nodes[i],
						activation: 'selu'
					});
					model.add(hidden);
				} else {
					let hidden = tf.layers.dense({
						units: this.hidden_nodes[i],
						activation: 'selu'
					});
					model.add(hidden);
				}
			}
			const output = tf.layers.dense({
				units: this.output_nodes,
				activation: 'sigmoid'
			}); //might want to use linear, but sigmoid in this instance might be for the best.
			model.add(output);
			return model;
			}
	  	}
	
	// function keyPressed() {
	//   if (key === 'S') {
	//     let NN = NNs[0];
	//     saveJSON(NN.brain, 'NN.json');
	//   }
	// }
	
	  tf.setBackend('cpu');
	
	  for (let i = 0; i < TOTAL; i++) {

		NNs[i] = new NN();
	  }
	
	
	function nextGeneration() {
		// console.log('next generation');
		calculateFitness();
		for (let i = 0; i < TOTAL; i++) {
		NNs[i] = pickOne(i);
		}
		savedNNs = [];
	  }
	  
	  function pickOne(pos) {
		let index = 0;
		let r = Math.random();
		while (r > 0) {
			r = r - NNFitnesses[index];
		  index++;
		}
		index--;
		let child;
		if (pos == 0) {
			let NeuralN;
			NeuralN = savedNNs[winnerList[0]];
			child = NeuralN;
		} else if (pos == TOTAL && window.prevWinner != undefined && TOTAL > 2) {
			let NeuralN;
			NeuralN = window.prevWinner;
			child = NeuralN;
		} else {
			let NeuralN = savedNNs[index];
			child = NeuralN;
			child.mutate();
		}
		return child;
	  }
	  
	  function calculateFitness() {
		let sum = 0;
		for (let score of NNScores) {
			sum += score;
			// console.log(NN.score);
		}
		for (let j=0; j<TOTAL; j++) {
			NNFitnesses.push(NNScores[j] / sum);
		}
	  }
	
		var Test = function() {
			this.__constructor(arguments);
		}
		
	
		  
		  
		  var Vec = function(x, y) {
			this.x = x;
			this.y = y;
		  }
		  Vec.prototype = {
			
			// utilities
			dist_from: function(v) { return Math.sqrt(Math.pow(this.x-v.x,2) + Math.pow(this.y-v.y,2)); },
			length: function() { return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2)); },
			
			// new vector returning operations
			add: function(v) { return new Vec(this.x + v.x, this.y + v.y); },
			sub: function(v) { return new Vec(this.x - v.x, this.y - v.y); },
			rotate: function(a) {  // CLOCKWISE
			  return new Vec(this.x * Math.cos(a) + this.y * Math.sin(a),
							 -this.x * Math.sin(a) + this.y * Math.cos(a));
			},
			
			// in place operations
			scale: function(s) { this.x *= s; this.y *= s; },
			normalize: function() { var d = this.length(); this.scale(1.0/d); }
		  }
		  
		  // line intersection helper function: does line segment (p1,p2) intersect segment (p3,p4) ?
		  var line_intersect = function(p1,p2,p3,p4) {
			var denom = (p4.y-p3.y)*(p2.x-p1.x)-(p4.x-p3.x)*(p2.y-p1.y);
			if(denom===0.0) { return false; } // parallel lines
			var ua = ((p4.x-p3.x)*(p1.y-p3.y)-(p4.y-p3.y)*(p1.x-p3.x))/denom;
			var ub = ((p2.x-p1.x)*(p1.y-p3.y)-(p2.y-p1.y)*(p1.x-p3.x))/denom;
			if(ua>0.0&&ua<1.0&&ub>0.0&&ub<1.0) {
			  var up = new Vec(p1.x+ua*(p2.x-p1.x), p1.y+ua*(p2.y-p1.y));
			  return {ua:ua, ub:ub, up:up}; // up is intersection point
			}
			return false;
		  }
		  
		  var line_point_intersect = function(p1,p2,p0,rad) {
			var v = new Vec(p2.y-p1.y,-(p2.x-p1.x)); // perpendicular vector
			var d = Math.abs((p2.x-p1.x)*(p1.y-p0.y)-(p1.x-p0.x)*(p2.y-p1.y));
			d = d / v.length();
			if(d > rad) { return false; }
			
			v.normalize();
			v.scale(d);
			var up = p0.add(v);
			if(Math.abs(p2.x-p1.x)>Math.abs(p2.y-p1.y)) {
			  var ua = (up.x - p1.x) / (p2.x - p1.x);
			} else {
			  var ua = (up.y - p1.y) / (p2.y - p1.y);
			}
			if(ua>0.0&&ua<1.0) {
			  return {ua:ua, up:up};
			}
			return false;
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
				if (window.testingMode) {
					if (e.code == "KeyW") {
						window.up[0] = true;
					} if (e.code == "KeyA") {
						window.left[0] = true;
					} if (e.code == "KeyS") {
						window.down[0] = true;
					} if (e.code == "KeyD") {
						window.right[0] = true;
					} if (e.code == "Space") {
						window.heavy[0] = true;
					}
					if (e.code == "ArrowUp") {
						window.up[0] = true;
					} if (e.code == "ArrowLeft") {
						window.left[0] = true;
					} if (e.code == "ArrowDown") {
						window.down[0] = true;
					} if (e.code == "ArrowRight") {
						window.right[0] = true;
					} if (e.code == "KeyX") {
						window.heavy[0] = true;
					}
				}
			}
			this._handleKeyUp = function(e) {
				if (window.testingMode) {
					if (e.code == "KeyW") {
						window.up[0] = false;
					} else if (e.code == "KeyA") {
						window.left[0] = false;
					} else if (e.code == "KeyS") {
						window.down[0] = false;
					} else if (e.code == "KeyD") {
						window.right[0] = false;
					} else if (e.code == "Space") {
						window.heavy[0] = false;
					}
					if (e.code == "ArrowUp") {
						window.up[0] = false;
					} if (e.code == "ArrowLeft") {
						window.left[0] = false;
					} if (e.code == "ArrowDown") {
						window.down[0] = false;
					} if (e.code == "ArrowRight") {
						window.right[0] = false;
					} if (e.code == "KeyX") {
						window.heavy[0] = false;
					}
				}
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
		Test.prototype.createWorld = function() {
	
			window.up[0] = false;
			window.down[0] = false;
			window.left[0] = false;
			window.right[0] = false;
			window.heavy[0] = false;
			window.up[1] = false;
			window.down[1] = false;
			window.left[1] = false;
			window.right[1] = false;
			window.heavy[1] = false;
			window.onPlatform = [false,false];
	
			var m_world = new b2World(new b2Vec2(0.0, -9.81*3.25), true);
			m_physScale = 10;
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
				if (contact.GetFixtureA().GetUserData() == 'Foot1' && contact.GetFixtureB().GetBody().GetUserData() == 'Floor') {
					onPlatform[0] = true;
				}
				if (contact.GetFixtureA().GetUserData() == 'Foot2' && contact.GetFixtureB().GetBody().GetUserData() == 'Floor') {
					onPlatform[1]= true;
				}
				if ((contact.GetFixtureA().GetBody().GetUserData() == 'Player1' && contact.GetFixtureB().GetBody().GetUserData() == 'Player2') || (contact.GetFixtureB().GetBody().GetUserData() == 'Player1' && contact.GetFixtureA().GetBody().GetUserData() == 'Player2')) {
					hasCollided = true;
					if (canColReward && !window.testingMode) {
						reward += (window.heavy[1] == true) ? strengths[1]/roundCap/5 : 1/roundCap;
						reward2 += (window.heavy[0] == true) ? strengths[0]/roundCap/5 : 1/roundCap;
					}
				}
			}
			listener.EndContact = function(contact) {
				// console.log(contact.GetFixtureA().GetBody().GetUserData());
				if (contact.GetFixtureA().GetUserData() == 'Foot1' && contact.GetFixtureB().GetBody().GetUserData() == 'Floor') {
					onPlatform[0] = false;
				}
				if (contact.GetFixtureA().GetUserData() == 'Foot2' && contact.GetFixtureB().GetBody().GetUserData() == 'Floor') {
					onPlatform[1]= false;
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
			if (this._canvas == null)
				return;
			var c = this._canvas.getContext("2d");
			c.fillStyle = "white";
			c.fillRect(-5,-5,this._canvas.width+5, this._canvas.height+5);
			this._dbgDraw.SetSprite(c);
			if(this._world && window.draw) {
				this._world.SetDebugDraw(this._dbgDraw);
				this._world.DrawDebugData();
			}
	
			c.fillStyle = "black";
            c.fillText("score: red - " + window.scores[0] + " - blue - " + window.scores[1], 250, 15);
            c.fillText("generation : "+generation, 250, 30);
            c.fillText("current match : Network #" + winnerList[currentNN]+" VS Network #"+winnerList[currentNN+1],250, 45);
		if (window.debug) {
			let PPosX = window.Player1.GetPosition().x;
                	let PPosY = window.Player1.GetPosition().y;
                	let change = 360/(window.eyes*2);
                	for (let l=0; l<(window.eyes)*2; l++) {
                    	let distVal = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.sin(((l)*change)/180*Math.PI)*200), PPosY-(Math.cos(((l)*change)/180*Math.PI)*200))).distance || null;
                    	c.fillText(Math.round(distVal), (PPosX*11.5) + PPosX+(Math.sin(((l)*change)/180*Math.PI)*distVal*11.5) , ((PPosY*-12.8)+600) + PPosY+(Math.cos(((l)*change)/180*Math.PI)*distVal*11.5));
                }
				
				//for (let i = 0; i < NNScores.length; i+=2) {
				//	if (NNScores[i]>NNScores[i+1]) {
				//		c.fillStyle = "rgb("+(0)+","+(180)+","+(0)+")"; //green
				//	}
				//	if (NNScores[i]<NNScores[i+1]) {
				//		c.fillStyle = "rgb("+(180)+","+(0)+","+(0)+")"; //red
				//	}
				//	if (NNScores[i]== 0 && NNScores[i+1] == 0) {
				//		c.fillStyle = "rgb("+(0)+","+(0)+","+(0)+")";  //black
				//	}
				//	if (winnerList[currentNN]==i || winnerList[currentNN+1]==i){
				//		c.fillStyle = "rgb("+(80)+","+(80)+","+(255)+")"; //blue
				//	}
				//	c.fillText("NNscores[" + (i) + "]: " + NNScores[i],5,115+i/2*10);//currentNN
				//}
				//c.fillText("currentNN : "+currentNN, 250, 60);
				//c.fillText("winnerList[currentNN] : "+winnerList[currentNN], 250, 70);
				//for (let i = 0; i < NNScores.length; i+=2) {
				//	if (NNScores[i+1]>NNScores[i]) {
				//		c.fillStyle = "rgb("+(0)+","+(180)+","+(0)+")"; //green
				//	}
				//	if (NNScores[i]>NNScores[i+1]) {
				//		c.fillStyle = "rgb("+(180)+","+(0)+","+(0)+")"; //red
				//	}
				//	if (NNScores[i]== 0 && NNScores[i+1] == 0) {
				//		c.fillStyle = "rgb("+(0)+","+(0)+","+(0)+")";  //black
				//	}
				//	if (winnerList[currentNN]==i+1 || winnerList[currentNN+1]==i+1){
				//		c.fillStyle = "rgb("+(80)+","+(80)+","+(255)+")"; //blue
				//	}
				//	c.fillText("NNscores[" + (i+1) + "]: " + NNScores[i+1],205,115+i/2*10);
				//}
				for (let i = 0; i < winnerList.length; i++) {
					c.fillStyle = "rgb("+(0)+","+(0)+","+(0)+")";
					if (currentNN==i){
						c.fillStyle = "rgb("+(80)+","+(80)+","+(255)+")"; //blue
						c.fillText("current match : Network #" + winnerList[i]+" VS Network #"+winnerList[i+1],250, 45);
					}
					if (currentNN+1==i){
						c.fillStyle = "rgb("+(80)+","+(80)+","+(255)+")"; //blue
					}
					c.fillText("winnerList[" + (i) + "]: " + winnerList[i],500,10+(i)*9);
				}
			}

			if(this._paused) {
				c.fillText("paused", 5, 15);
			} else {
				c.fillText("FPS: " + this._fpsAchieved, 5, 15);
				c.fillText("Game: "+(TOTAL-winnerList.length+1) + " of " + (TOTAL-1), 5, 90);
            			c.fillText("Round: "+(round+1) + " of " + roundCap, 5, 105);
				c.fillText("speed:" + supaSpeed,5, 30);
			}
			c.fillStyle = "rgb("+(240)+","+(64)+","+(64)+")";
			// c.strokeStyle = "rgb(255,255,255)";
			if (window.draw) {
				c.beginPath();
				c.lineWidth = 1;
				c.arc(window.Player1.GetPosition().x*12.5,-window.Player1.GetPosition().y*12.5+this._canvas.height,20,0,2*Math.PI);
				c.fill();
				c.fillStyle = "rgb(0,0,0)";

				c.fillStyle = "rgb("+(64)+","+(64)+","+(240)+")";
				// c.strokeStyle = "rgb(255,255,255)";
				c.beginPath();
				c.lineWidth = 1;
				c.arc(window.Player2.GetPosition().x*12.5,-window.Player2.GetPosition().y*12.5+this._canvas.height,20,0,2*Math.PI);
				c.fill();
				c.fillStyle = "rgb(0,0,0)";
				if (window.heavy[0]) {
					c.strokeStyle = "rgb("+(127*(strengths[0]/maxStrengths[0])+127)+","+(127*(strengths[0]/maxStrengths[0])+127)+","+(127*(strengths[0]/maxStrengths[0])+127)+")";
					// c.strokeStyle = "rgb(255,255,255)";
					c.beginPath();
					c.lineWidth = 3;
					c.arc(window.Player1.GetPosition().x*12.5,-window.Player1.GetPosition().y*12.5+this._canvas.height,20,0,2*Math.PI);
					c.stroke();
					c.strokeStyle = "rgb(0,0,0)";
				}
				if (window.heavy[1]) {
					c.strokeStyle = "rgb("+(127*(strengths[1]/maxStrengths[1])+127)+","+(127*(strengths[1]/maxStrengths[1])+127)+","+(127*(strengths[1]/maxStrengths[1])+127)+")";
					// c.strokeStyle = "rgb(255,255,255)";
					c.beginPath();
					c.lineWidth = 3;
					c.arc(window.Player2.GetPosition().x*12.5,-window.Player2.GetPosition().y*12.5+this._canvas.height,20,0,2*Math.PI);
					c.stroke();
					c.strokeStyle = "rgb(0,0,0)";
				}
			}
		}
		
		const maxStrengths = [10,10];				//array of player heavy-mass.
		var strengths = maxStrengths.slice(0);		//copy the maxStrengths array.
		var decay = 0.005; 							//constant
		var regrowth = 0.01; 						//constant
		var slowDown = false;
		var action;
		var steps = 0;
		var playerDistance = 0;
		Test.prototype.step = function(delta) {
			if (window.testingChange) {
				window.testingChange = false;
				this.endGame(-1);
			}
			var delta = (typeof delta == "undefined") ? 1/this._fps : delta;
			for (i = 0; i < supaSpeed; i++) { // a for loop that iterates the this._world.Step() function "supaSpeed" amount of times before each render.
				if (!window.testingMode) {
					steps++;
					if (steps > 5000) {this.endGame(-1); break;}
				}
				playerDistance = Math.pow(window.Player1.GetPosition().x-window.Player2.GetPosition().x, 2)+Math.pow(window.Player1.GetPosition().y-window.Player2.GetPosition().y, 2);
				if (playerDistance<10 && hasCollided == true) {
					canColReward = false;
				} else {
					canColReward = true; hasCollided = false;
				}
				let p1Lead = window.scores[0]-window.scores[1];
				let p2Lead = window.scores[1]-window.scores[0];
				if (window.Player1.GetPosition().x < -20 || window.Player1.GetPosition().x > 80 || window.Player1.GetPosition().y < 0 || window.Player1.GetPosition().y > 200 || p1Lead <=-leadTolerance) {
					//if red is offscreen
					if (!window.testingMode) {
						reward  += 10; //blue's reward
					}
					this.endGame(1);
					break;
				} else if (window.Player2.GetPosition().x < -20 || window.Player2.GetPosition().x > 80 || window.Player2.GetPosition().y < 0 || window.Player2.GetPosition().y > 200 || p2Lead <=-leadTolerance) {
					//if blue is offscreen
					if (!window.testingMode) {
						reward2 += 10; //red's reward
					}
					this.endGame(0);
					break;
				}
				if(!this._world)
					return;
				this._world.ClearForces();
				if (!window.testingMode) {
					reward -= 0.001;
					reward2 -= 0.001;
					reward -= Math.abs(window.Player2.GetLinearVelocity().x)/5000;
					reward2 -= Math.abs(window.Player1.GetLinearVelocity().x)/5000;
				}
				window.up[1] = false;
				window.down[1] = false;
				window.left[1] = false;
				window.right[1] = false;
				window.heavy[1] = false;
				if (!window.testingMode) {
					window.up[0] = false;
					window.down[0] = false;
					window.left[0] = false;
					window.right[0] = false;
					window.heavy[0] = false;
				}
				//We don't want a for loop, as we only want one neural network going at once. We will do iterative generation testing.
				// for (let i=0; i<NNs.length; i++) {
				if (!window.testingMode) {
					let index = winnerList[currentNN];
					let index2 = winnerList[currentNN+1];
	// 				console.log(Math.floor(index/(TOTAL/2)));
	// 				console.log(index%(TOTAL/2));
					NNs[index].think(0);
					if (controlPlayer1) {

						NNs[index2].think(1);
					}
				} else if (window.testModel != undefined) {
					let inputs = [];
					let color = "blue";
					if (color == "red") {
						inputs[0] = sigmoid(window.Player1.GetLinearVelocity().x/5); //contains values to just -20 to 20.
						inputs[1] = sigmoid(window.Player1.GetLinearVelocity().y/5);
						inputs[2] = sigmoid(strengths[0]/5);
						inputs[3] = sigmoid(strengths[1]/5);
						inputs[4] = sigmoid((window.Player1.GetPosition().x-window.Player2.GetPosition().x)/5);
						inputs[5] = sigmoid((window.Player1.GetPosition().y-window.Player2.GetPosition().y)/5);
						let PPosX = window.Player1.GetPosition().x;
						let PPosY = window.Player1.GetPosition().y;
						
						let change = 360/(window.eyes*2);
						for (let l=0; l<(window.eyes)*2; l++) {
							inputs[6+l] = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((l*change)/180*Math.PI)*75), PPosY-(Math.sin((l*change)/180*Math.PI)*75))).distance || -1;
						}
					} else {
						inputs[0] = sigmoid(window.Player2.GetLinearVelocity().x/5);
						inputs[1] = sigmoid(window.Player2.GetLinearVelocity().y/5);
						inputs[2] = sigmoid(strengths[1]/5);
						inputs[3] = sigmoid(strengths[0]/5);
						inputs[4] = sigmoid((window.Player2.GetPosition().x-window.Player1.GetPosition().x)/5);
						inputs[5] = sigmoid((window.Player2.GetPosition().y-window.Player1.GetPosition().y)/5);
						let PPosX = window.Player2.GetPosition().x;
						let PPosY = window.Player2.GetPosition().y;

						let change = 360/(window.eyes*2);
						for (let l=0; l<(window.eyes)*2; l++) {
							inputs[6+l] = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((l*change)/180*Math.PI)*75), PPosY-(Math.sin((l*change)/180*Math.PI)*75))).distance || -1;

						}
					}
					let output = predict();
					function predict() {
					return tf.tidy(() => {
						const xs = tf.tensor2d([inputs]);
						const ys = window.testModel.predict(xs);
						const outputs = ys.dataSync();
						// console.log(outputs);
						return outputs;
					  });
					}
					if (output[0] < (8/18)) {
						window.down[1] = true;
					} else if (output[0] > (10/18)) {
						window.up[1] = true;
					}
				  	if (output[1] < (8/18)) {
						window.left[1] = true;
					} else if (output[1] > (10/18)) {
						window.right[1] = true;
					}
					if (0.5 < output[2]) {
						window.heavy[1] = true;
					}
				}
				// }
				if (window.heavy[0]) {
					// slowDown = true;
					window.PFixture1.SetDensity(strengths[0]);
					// console.log(PFixture1);
					window.Player1.ResetMassData();
					if (strengths[0]>1) {
						strengths[0]-=(decay*maxStrengths[0]);
					} else {
						strengths[0] = 1;
					}
				} else {
					// slowDown = false;
					window.PFixture1.SetDensity(1);
					window.Player1.ResetMassData();
					if (strengths[0]<maxStrengths[0]) {
						strengths[0]+=(regrowth*maxStrengths[0]);
					} else {
						strengths[0] = maxStrengths[0];
					}
				}
				if (window.heavy[1]) {
					// slowDown = true;
					window.PFixture2.SetDensity(strengths[1]);
					// console.log(PFixture2);
					window.Player2.ResetMassData();
					if (strengths[1]>1) {
						strengths[1]-=(decay*maxStrengths[1]);
					} else {
						strengths[1] = 1;
					}
				} else {
					// slowDown = false;
					window.PFixture2.SetDensity(1);
					window.Player2.ResetMassData();
					if (strengths[1]<maxStrengths[1]) {
						strengths[1]+=(regrowth*maxStrengths[1]);
					} else {
						strengths[1] = maxStrengths[1];
					}
				}
				if (window.up[0]) {
					if (onPlatform[0] && window.Player1.GetLinearVelocity().y < 4) {
						// window.Player1.ApplyForce(new b2Vec2(0, 20000), window.Player1.GetPosition());
						let newPlayer1_velocity = new b2Vec2(window.Player1.GetLinearVelocity().x,window.Player1.GetLinearVelocity().y);
						newPlayer1_velocity.y = 16;//upwards - don't change x velocity
						window.Player1.SetLinearVelocity(newPlayer1_velocity);
						onPlatform[0]=false;
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
				if (window.up[1]) {
					if (onPlatform[1] && window.Player2.GetLinearVelocity().y < 4) {
						// window.Player2.ApplyForce(new b2Vec2(0, 20000), window.Player2.GetPosition());
						let newPlayer2_velocity = new b2Vec2(window.Player2.GetLinearVelocity().x,window.Player2.GetLinearVelocity().y);
						newPlayer2_velocity.y = 16;//upwards - don't change x velocity
						window.Player2.SetLinearVelocity(newPlayer2_velocity);
						onPlatform[1]=false;
					}
					window.Player2.ApplyForce(new b2Vec2(0, speed), window.Player2.GetPosition());
				}
				if (window.down[1]) {
					window.Player2.ApplyForce(new b2Vec2(0, -speed), window.Player2.GetPosition());
				}
				if (window.left[1]) {
					window.Player2.ApplyForce(new b2Vec2(-speed, 0), window.Player2.GetPosition());
				}
				if (window.right[1]) {
					window.Player2.ApplyForce(new b2Vec2(speed, 0), window.Player2.GetPosition());
				}		
				this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);
			}
		}
		
		Test.prototype.supaSpeedUp = function () {
			if (supaSpeed < 256) {
				supaSpeed*=2; //increase iterations
			}
		}
		
		Test.prototype.supaSpeedDown = function () {
			if (supaSpeed>1) { //decrease iterations only if it's over 1, we don't want this._world.Step() to never get called...
				supaSpeed/=2;
			}
		}
		
		window.scores = [0,0];
		var activeNNs = 1;
		var NNScores = [];
		for (let i=0; i<TOTAL; i++) {
			NNScores.push(0);
		}
		var NNFitnesses = [];
	
		Test.prototype.endGame = function (winner) {
			if (!window.testingMode) {
				round++;
			}
	
			// console.log(winnerList);
			// console.log(winnerList.length);
			if (!window.testingMode) {
				steps = 0;
				let index = winnerList[currentNN];
				let index2 = winnerList[currentNN+1];
				// NNScores[index] += reward;
				// if (controlPlayer1) {
				// 	NNScores[index2] += reward2;
				// }
				if (round >= roundCap) {
					window.scores = [0,0];
					if (reward > reward2) {
						NNScores[index2] += 10;
						if (winnerList.length == 2) {secondBest = NNs[index];}
						winnerList.splice(currentNN, 1);
					}
					if (reward2 > reward) {
						NNScores[index] += 10;
						if (winnerList.length == 2) {secondBest = NNs[index2];}
						winnerList.splice(currentNN+1, 1);
					}
					reward = 0;
					reward2 = 0;
				}
				if (window.saveRedNN) {
					console.log(NNs[0][0]);
					NNs[index].brain.model.save("localstorage://savedModel");
					window.saveRedNN = false;
				}
				if (window.saveBlueNN) {
					NNs[index2].brain.model.save("localstorage://savedModel");
					window.saveBlueNN = false;
				}
	
				if (controlPlayer1) {activeNNs = 2;} else {activeNNs = 1;}
				if (currentNN < winnerList.length-1) {
					// (controlPlayer1) ? currentNN+=2 : currentNN++;
					if (round >= roundCap) {
						round = 0;
						currentNN++;
					}
					// console.log(winnerList);
				} else if (round >= roundCap) {
					round = 0;
					currentNN = 0;
					if (winnerList.length == 1) {
						if (window.saveTourneyWinner == true) {
							NNs[winnerList[0]].brain.model.save("localstorage://savedModel");
							window.saveTourneyWinner = false;
						}
						window.prevWinner = window.winner;
						window.winner = winnerList[0];
						generation++;
						// NNScores[Math.floor(winnerList[0]/TOTAL)][winnerList[0]] += TOTAL; //large reward for tournament winner.
						savedNNs = [...NNs];
						nextGeneration();
						NNScores = [];
						for (let i=0; i<TOTAL; i++) {
							// NNScores[0].push(i);
							// NNScores[1].push(i);
							NNScores.push(0);
						}
						NNFitnesses = [];
						winnerList = [];
						for (let j=0; j<TOTAL; j++) {
							winnerList.push(j);
						}
						//Can comment out
						window.level++;
						if (window.level >= window.runners.length) {window.level = 0;}
					}
				}
			}
	
			if (winner != -1 && !window.testingMode) {
				window.scores[winner]++;
			}
			window.up = [false, false];
			window.down = [false, false];
			window.left = [false, false];
			window.right = [false, false];
			window.space = [false, false];
			strengths = [maxStrengths[0],maxStrengths[1]];
			window.onPlatform = [false,false];

			if(window.runner) {
				window.wasPaused = runner.isPaused();
				window.runner.destroy();
			}
			window.runner = new window.runners[window.level]($("#canvas")[0]);
			if(window.wasPaused)
				window.runner.draw();
			else	
				window.runner.resume();
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
		
		var speed = 140;
		window.up = [false,false];
		window.down = [false,false];
		window.left = [false,false];
		window.right = [false,false];
		window.heavy = [false,false];
		// Test.prototype._updateKeyboardInteraction = function() {
			// TBD
	
			// if (this._keyDown != undefined) {
			// 	if (this._keyDown == "KeyW") {
			// 		window.up[0] = true;
			// 	} else if (this._keyDown == "KeyA") {
			// 		window.left[0] = true;
			// 	} else if (this._keyDown == "KeyS") {
			// 		window.down[0] = true;
			// 	} else if (this._keyDown == "KeyD") {
			// 		window.right[0] = true;
			// 	} else if (this._keyDown == "Space") {
			// 		window.heavy[0] = true;
			// 	}
			// }
			// if (this._keyUp != undefined) {
			// 	if (this._keyUp == "KeyW") {
			// 		window.up[0] = false;
			// 	} else if (this._keyUp == "KeyA") {
			// 		window.left[0] = false;
			// 	} else if (this._keyUp == "KeyS") {
			// 		window.down[0] = false;
			// 	} else if (this._keyUp == "KeyD") {
			// 		window.right[0] = false;
			// 	} else if (this._keyUp == "Space") {
			// 		window.heavy[0] = false;
			// 	}
			// }
			// 	this._keyDown = undefined;
			// 	this._keyUp = undefined;
		// }
		
		Test.prototype._updateUserInteraction = function() {
			this._updateMouseInteraction();
			// this._updateKeyboardInteraction();
			
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
			if (Math.floor(delta)%10 == 0) {
				// reward = 0;
			}
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
		
		window.gameEngine = Test;
			
		})();
	
