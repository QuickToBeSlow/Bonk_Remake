(function(){

//code for Gaussian

function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}



// Daniel Shiffman
// Neuro-Evolution Flappy Bird with TensorFlow.js
// http://thecodingtrain.com
// https://youtu.be/cdUNkwXx-I4
// The base of the neural network handling was written by this awesome dude. Props to him!
// I simply changed out some code and omitted the unnecessary bits for my purposes.

/*
variables to change:
birds --> NNs (done)
savedBirds --> savedNNs (done)
class Bird --> class NN (done)

TODO (if I get stuck):
rewrite think function of the neural network. Make sure to change the inputs namely. (done)

*/
var controlPlayer1 = true;
var currentNN = 0;
var TOTAL = 50;
var NNs = [[],[]];
var savedNNs = [[],[]];
var reward = 0;
var reward2 = 0;
var supaSpeed =1; //set supaSpeed to 1 when the page is loaded.
var canColReward = true;
var hasCollided = false;

class NN {
	constructor(brain) {
	  this.score = 0;
	  this.fitness = 0;
	  if (brain) {
		this.brain = brain.copy();
	  } else {
		this.brain = new NeuralNetwork(10, [8, 4,6], 6);
	  }
	}
  
	dispose() {
	  this.brain.dispose();
	}

	mutate() {
	  this.brain.mutate(0.1);
	}
  
	think(i) {
		let inputs = [];
		inputs[0] = window.Player1.GetPosition().x;
		inputs[1] = window.Player1.GetPosition().y;
		inputs[2] = window.Player1.GetLinearVelocity().x;
		inputs[3] = window.Player1.GetLinearVelocity().y;
		inputs[4] = window.Player2.GetPosition().x;
		inputs[5] = window.Player2.GetPosition().y;
		inputs[6] = window.Player2.GetLinearVelocity().x;
		inputs[7] = window.Player2.GetLinearVelocity().y;
		inputs[8] = window.heavy[0];
		inputs[9] = window.heavy[1];
	  let output = this.brain.predict(inputs);
	  if (output[0] < output[1]) {
			window.up[i] = true;
		}
	  if (output[0] < output[2]) {
		window.down[i] = true;
		}
	  if (output[0] < output[3]) {
		window.left[i] = true;
		}
	  if (output[0] < output[4]) {
		window.right[i] = true;
		}
	  if (output[0] < output[5]) {
		window.heavy[i] = true;
		}
	}
  
	update() {
	  this.score++;
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
		return new NeuralNetwork(
		  modelCopy,
		  this.input_nodes,
		  this.hidden_nodes,
		  this.output_nodes
		);
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
			  values[j] = w + randn_bm();
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
			const hidden = tf.layers.dense({
				units: this.hidden_nodes[i],
				inputShape: [this.input_nodes],
				activation: 'relu'
			});
			model.add(hidden);
		} else if (i%2 == 0) {
			const hidden = tf.layers.dense({
				units: this.hidden_nodes[i],
				activation: 'relu'
			});
			model.add(hidden);
		} else {
			const hidden = tf.layers.dense({
				units: this.hidden_nodes[i],
				activation: 'softmax'
			});
			model.add(hidden);
		}
	}
	  const output = tf.layers.dense({
		units: this.output_nodes,
		activation: 'softmax'
	  });
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
	NNs[0][i] = new NN();
	if (controlPlayer1) {
		NNs[1][i] = new NN();
	}
  }

function nextGeneration() {
	// console.log('next generation');
	calculateFitness(0);
	calculateFitness(1);
	for (let i = 0; i < TOTAL; i++) {
	  NNs[0][i] = pickOne(0);
	  if (controlPlayer1) {
	  	NNs[1][i] = pickOne(1);
	  }
	}
	// for (let i = 0; i < TOTAL; i++) {
	// 	savedNNs[0][i].dispose();
	// 	if (controlPlayer1) {
	// 		savedNNs[1][i].dispose();
	// 	}
	// }
	savedNNs = [[], []];
  }
  
  function pickOne(ind) {
	let index = 0;
	let r = Math.random();
	// console.log(savedNNs);
	while (r > 0) {
		// console.log(savedNNs[i][index].fitness); 
		// console.log(r);
		r = r - NNFitnesses[ind][index];
	  index++;
	}
	index--;
	let NeuralN = savedNNs[ind][index];
	let child = new NN(NeuralN.brain);
	child.mutate();
	return child;
  }
  
  function calculateFitness(i) {
	let sum = 0;
	for (let score of NNScores[i]) {
		sum += score;
		// console.log(NN.score);
	}
	for (let j=0; j<TOTAL; j++) {
		NNFitnesses[i].push(NNScores[i][j] / sum);
	}
	// for (let NN of savedNNs[1]) {
	// 	sum[1] += NN.score;
	//   }
	// for (let NN of savedNNs[1]) {
	// 	NN.fitness = NN.score / sum[1];
	// }
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
			if (e.code == "KeyW") {
				window.up[0] = true;
			} else if (e.code == "KeyA") {
				window.left[0] = true;
			} else if (e.code == "KeyS") {
				window.down[0] = true;
			} else if (e.code == "KeyD") {
				window.right[0] = true;
			} else if (e.code == "Space") {
				window.heavy[0] = true;
			}
		}
		this._handleKeyUp = function(e) {
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
		
		
		
		reward = 0;
		reward2 = 0;



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
			}
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player2') {
				onPlatform[1]= true;
			}
			if ((contact.GetFixtureA().GetBody().GetUserData() == 'Player1' && contact.GetFixtureB().GetBody().GetUserData() == 'Player2') || (contact.GetFixtureB().GetBody().GetUserData() == 'Player1' && contact.GetFixtureA().GetBody().GetUserData() == 'Player2')) {
				hasCollided = true;
				if (canColReward) {
					reward += (window.heavy[1] == true) ? strengths[1]/5 : 1;
					reward2 += (window.heavy[0] == true) ? strengths[0]/5 : 1;
				}
			}
		}
		listener.EndContact = function(contact) {
			// console.log(contact.GetFixtureA().GetBody().GetUserData());
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player1') {
				onPlatform[0] = false;
			}
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player2') {
				onPlatform[1] = false;
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
		c.fillText("score: "+window.scores[0]+" - "+window.scores[1], 250, 22.5);
		c.fillText("current reward (Player1): "+Math.round(reward2*1000)/1000,5,40);
		c.fillText("current reward (Player2): "+Math.round(reward*1000)/1000,5,57.5);
        c.fillText("generation : "+Math.floor((window.scores[0]+window.scores[1])/TOTAL),250,40);
		c.fillText("KD : " + Math.round(window.scores[1]/window.scores[0]*1000)/1000,250,75);
		if(this._paused) {
			c.fillText("paused", 5, 15);
			c.fillText("speed:" + supaSpeed,5, 30);
		} else {
			c.fillText("FPS: " + this._fpsAchieved, 5, 15);
			c.fillText("speed:" + supaSpeed,5, 30);
		}
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
	
	const maxStrengths = [10,10];				//array of player heavy-mass.
	var strengths = maxStrengths.slice(0);		//copy the maxStrengths array.
	var decay = 0.005; 							//constant
	var regrowth = 0.01; 						//constant
	var slowDown = false;
	var action;
	var steps = 0;
	var playerDistance = 0;
	Test.prototype.step = function(delta) {
		var delta = (typeof delta == "undefined") ? 1/this._fps : delta;
		for (i = 0; i < supaSpeed; i++) { // a for loop that iterates the this._world.Step() function "supaSpeed" amount of times before each render.
			steps++;
			if (steps > 5000) {this.endGame(-1)}
			playerDistance = Math.pow(window.Player1.GetPosition().x-window.Player2.GetPosition().x, 2)+Math.pow(window.Player1.GetPosition().y-window.Player2.GetPosition().y, 2);
			if (playerDistance<100 && hasCollided == true) {canColReward = false;} else {canColReward = true; hasCollided = false;}
			if (window.Player1.GetPosition().x < -100 || window.Player1.GetPosition().x > 1000 || window.Player1.GetPosition().y < 0) {
				//Player2 wins
				reward += 5;
				reward2 -= 5;
				this.endGame(1);
			} else if (window.Player2.GetPosition().x < -100 || window.Player2.GetPosition().x > 1000 || window.Player2.GetPosition().y < 0) {
				//Player1 wins
				reward -= 5;
				reward2 += 5;
				this.endGame(0);
			}
			if(!this._world)
				return;
			this._world.ClearForces();
			reward -= 0.001;
			reward2 -= 0.001;
			reward += (150-Math.abs(30-window.Player2.GetPosition().x))/180000;
			reward2 += (150-Math.abs(30-window.Player1.GetPosition().x))/180000;
			window.up[1] = false;
			window.down[1] = false;
			window.left[1] = false;
			window.right[1] = false;
			window.heavy[1] = false;
			//We don't want a for loop, as we only want one neural network going at once. We will do iterative generation testing.
			// for (let i=0; i<NNs.length; i++) {
			NNs[0][currentNN].think(0);
			NNs[0][currentNN].update();
			if (controlPlayer1) {
				NNs[1][currentNN].think(1);
				NNs[1][currentNN].update();
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
                    var newPlayer1_velocity = new b2Vec2(window.Player1.GetLinearVelocity().x,window.Player1.GetLinearVelocity().y);
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
                    var newPlayer2_velocity = new b2Vec2(window.Player1.GetLinearVelocity().x,window.Player1.GetLinearVelocity().y);
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
	var activeNNs = 1;
	var NNScores = [[], []];
	var NNFitnesses = [[], []];

	Test.prototype.endGame = function (winner) {
		steps = 0;
		NNScores[0].push(reward);
		NNs[0][currentNN].score = reward;
		if (controlPlayer1) {
			NNScores[1].push(reward2);
			NNs[1][currentNN].score = reward2;
		}
		if (controlPlayer1) {activeNNs = 2;} else {activeNNs = 1;}
		if (currentNN < TOTAL-1) {
			// (controlPlayer1) ? currentNN+=2 : currentNN++;
			currentNN++;
		} else {
			currentNN = 0;
			savedNNs = [...NNs];
			// for (let i=0; i<activeNNs; i++) {
			// 	for (let j=0; j<TOTAL; j++) {
			// 		savedNNs[i][j].score = NNScores[i][j];
			// 	}
			// }
			// console.log(NNs);
			// console.log(savedNNs);
			nextGeneration();
			NNScores = [[],[]];
			NNFitnesses = [[],[]];
		}
		if (winner != -1) {
			window.scores[winner]++;
		}
		window.up = [false, false];
		window.down = [false, false];
		window.left = [false, false];
		window.right = [false, false];
		window.space = [false, false];
		if(window.runner) {
			window.wasPaused = runner.isPaused();
			window.runner.destroy();
		}
		window.runner = new window.runners[0]($("#canvas")[0]);
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