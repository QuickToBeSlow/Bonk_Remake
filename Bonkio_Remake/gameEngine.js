(function(){

	//code for raycasting
	
	var rayCastInput = new b2RayCastInput();
	var rayCastOutput =  new b2RayCastOutput();
	var m_physScale = 10;

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
		return {
			normal: rayCastOutput.normal,
			fraction: rayCastOutput.fraction,
			distance: (rayCastOutput.fraction)*Math.sqrt(Math.pow(rayCastInput.p1.x-rayCastInput.p2.x, 2)+Math.pow(rayCastInput.p1.y-rayCastInput.p2.y, 2))
		}
	}
	  return false;
	}

	//QuickSort code

	function quickSort(items, left, right) {

		var ind;
	
		if (items.length > 1) {
	
			left = typeof left != "number" ? 0 : left;
			right = typeof right != "number" ? items.length - 1 : right;
	
			ind = partition(items, left, right);
	
			if (left < ind - 1) {
				quickSort(items, left, ind - 1);
			}
	
			if (ind < right) {
				quickSort(items, ind, right);
			}
	
		}
	
		return items;
	}
	function partition(items, left, right) {
	
		var pivot   = items[Math.floor((right + left) / 2)],
			i       = left,
			j       = right;
	
	
		while (i <= j) {
	
			while (items[i] < pivot) {
				i++;
			}
	
			while (items[j] > pivot) {
				j--;
			}
	
			if (i <= j) {
				swap(items, i, j);
				i++;
				j--;
			}
		}
	
		return i;
	}
	function swap(items, firstIndex, secondIndex){
		var temp = items[firstIndex];
		items[firstIndex] = items[secondIndex];
		items[secondIndex] = temp;
	}

	//code for Gaussian
	
	function randn_bm(restrict) {
		var u = 0, v = 0;
		while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
		while(v === 0) v = Math.random();
		let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
		num = num / 1.5;
		if (restrict == true) {
			// num = num / 10; // Translate to 0 -> 1
			if (num > 1 || num < 0) return randn_bm(true); // resample between 0 and 1
		}
		return num;
	}

	function sigmoid(value) {
		// return value;
		return (Math.pow(Math.E, value)/(1+Math.pow(Math.E, value)));
	}
	//converts inputs to sigmoid values (this is used for the inputs!)

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
	window.eyes = 4;
	window.groundEyes = 0;
	window.GRRange = 16;
	window.debug = false;
	window.draw = true;
	var eyeRange = 40;
	var velocityRange = 30;
	var eyeRotation = [];
	eyeRotation[0] = [];
	eyeRotation[1] = [];
	for (let i=0; i<window.eyes; i++) {
		eyeRotation[0][i]=0.5;
		eyeRotation[1][i]=0.5;
	}
	var controlPlayer1 = true;
	var round = 0;
	var roundCap = 7;
	var leadTolerance = 4;
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
		  this.lastOutputs=[];
		  for (let i=0; i<window.eyes; i++) {
			  this.lastOutputs[i]=0.5;
		  }

		  if (brain) {
			this.brain = brain.copy();
		  } else {
			this.brain = new NeuralNetwork(8+this.lastOutputs.length+(window.eyes), [10, 8], 3+this.lastOutputs.length);
		  }
		}
		
		dispose() {
		  this.brain.dispose();
		}
	
		mutate() {
		  this.brain.mutate(10/((8+this.lastOutputs.length+window.eyes)*10+10*10+10*(3+this.lastOutputs.length)));
		}
	  
		think(i) {
			let inputs = [];
			if (i==0) {
				inputs[0] = Math.max(Math.min((window.Player1.GetLinearVelocity().x/velocityRange), -1), 1);
				inputs[1] = Math.max(Math.min((window.Player1.GetLinearVelocity().y/velocityRange), -1), 1);
				inputs[2] = Math.max(Math.min((window.Player2.GetLinearVelocity().x/20), -1), 1);
				inputs[3] = Math.max(Math.min((window.Player2.GetLinearVelocity().y/20), -1), 1);
				inputs[4] = strengths[0]/10;
				inputs[5] = strengths[1]/10;
				inputs[6] = Math.max(Math.min(((window.Player1.GetPosition().x-window.Player2.GetPosition().x)/eyeRange), 1), -1);
				inputs[7] = Math.max(Math.min(((window.Player1.GetPosition().y-window.Player2.GetPosition().y)/eyeRange), 1), -1);
				let PPosX = window.Player1.GetPosition().x;
				let PPosY = window.Player1.GetPosition().y;
				// let GRSeparation = window.GRRange/window.groundEyes;
				// let tester;
				// let leftDisp = 0;
				// let rightDisp = 0;
				for(let m=0; m<window.eyes; m++) {
					inputs[8+m] = this.lastOutputs[m];
				}

				// let change = 360/(window.eyes)/180*Math.PI;
				console.log(this.lastOutputs[0]+", "+this.lastOutputs[1]+", "+this.lastOutputs[2]+", "+this.lastOutputs[3]);
				for (let m=0; m<window.eyes; m++) {
					eyeRotation[0][m] = (this.lastOutputs[m]*2-1.5+1*m%2)*Math.PI;
					// eyeRotation[0][m] = (this.lastOutputs[m]*2-1)*Math.PI;
					inputs[8+this.lastOutputs.length+m] = (raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((eyeRotation[0][m]))*eyeRange), PPosY-(Math.sin((eyeRotation[0][m]))*eyeRange))).distance || -eyeRange)/eyeRange;
				}
				// inputs[11] = 0.5;
				// for (let l=window.groundEyes/2; l>0; l--) {
				// 	tester = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
				// 	if (tester == -1) {
				// 		l--;
				// 		leftDisp = Math.abs((l+1)*GRSeparation-window.GRRange/2);
				// 		inputs[8] = leftDisp;
				// 		inputs[9] = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
				// 		break;
				// 	}
				// }

				// for (let l=window.groundEyes/2; l<window.groundEyes; l++) {
				// 	tester = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
				// 	if (tester == -1) {
				// 		l--;
				// 		rightDisp = Math.abs((l-1)*GRSeparation-window.GRRange/2);
				// 		inputs[10] = rightDisp;
				// 		inputs[11] = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
				// 		break;
				// 	}
				// }
				// console.log(inputs[8]);
				// console.log(inputs[9]);
				// console.log(inputs[10]);
				// console.log(inputs[11]);
				// inputs[8] = raycast(window.FloorFixture, new b2Vec2(PPosX+5, PPosY), new b2Vec2(PPosX+5, PPosY-75)).distance || -1;
				// inputs[9] = raycast(window.FloorFixture, new b2Vec2(PPosX-5, PPosY), new b2Vec2(PPosX-5, PPosY-75)).distance || -1;
				// let change = 360/(window.eyes);
				// for (let l=0; l<(window.eyes)*2; l++) {
				// 	inputs[12+l] = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((l*change)/180*Math.PI)*75), PPosY-(Math.sin((l*change)/180*Math.PI)*75))).distance) || 1;
				// }
			} else {
				inputs[0] = Math.max(Math.min((window.Player2.GetLinearVelocity().x/velocityRange), -1), 1);
				inputs[1] = Math.max(Math.min((window.Player2.GetLinearVelocity().y/velocityRange), -1), 1);
				inputs[2] = Math.max(Math.min((window.Player1.GetLinearVelocity().x/20), -1), 1);
				inputs[3] = Math.max(Math.min((window.Player1.GetLinearVelocity().y/20), -1), 1);
				inputs[4] = strengths[1]/10;
				inputs[5] = strengths[0]/10;
				inputs[6] = Math.max(Math.min(((window.Player2.GetPosition().x-window.Player1.GetPosition().x)/eyeRange), 1), -1);
				inputs[7] = Math.max(Math.min(((window.Player2.GetPosition().y-window.Player1.GetPosition().y)/eyeRange), 1), -1);
				let PPosX = window.Player2.GetPosition().x;
				let PPosY = window.Player2.GetPosition().y;

				// let p1Direction = Math.atan2(window.Player1.GetLinearVelocity().y,window.Player1.GetLinearVelocity().x) * (180/Math.PI);//p1 direction of momentum
				// let p1Speed = Math.sqrt(Math.pow(window.Player1.GetLinearVelocity().x,2)+Math.pow(window.Player1.GetLinearVelocity().y,2)); //p1 speed
				// let change = (180-(p1Speed*5))/(window.eyes); // makes the change value to half a circle, minus the player's speed * 5. (allowing for it to shrink dynamically as it goes faster.)
				// for (let l=Math.ceil(window.eyes*-.5); l<Math.floor(window.eyes/2); l++) {
				//   //here we will probably want the window.eyes var to be odd, so that it can see directly infront of it's momentum.
				//   //We can quickly see how this works with window.eyes = 7;  7*-.5 = -3.5, ceil(-3.5) == -3, looping -3 to 3. < this is our offset from our stored p1Direction var.
				//   inputs[8+l] = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((p1Direction+l)/180*Math.PI)*75), PPosY-(Math.sin((p1Direction+l)/180*Math.PI)*75))).distance || -1; //now it will loop through while using it's direction - the offset from the for-loop variable, which dynamically increases in magnitude, as speed increases.
				// }

				let GRSeparation = window.GRRange/window.groundEyes;
				let tester;
				let leftDisp = 0;
				let rightDisp = 0;

				for(let m=0; m<this.lastOutputs.length; m++) {
					inputs[8+m] = this.lastOutputs[m];
				}

				// let change = 360/(window.eyes)/180*Math.PI;
				for (let m=0; m<window.eyes; m++) {
					eyeRotation[1][m] = (this.lastOutputs[m]*2-1.5+1*m%2)*Math.PI;
					inputs[8+this.lastOutputs.length+m] = (raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((eyeRotation[1][m]))*eyeRange), PPosY-(Math.sin((eyeRotation[1][m]))*eyeRange))).distance || -eyeRange)/eyeRange;
				}
				
				// inputs[11] = 0.5;
				// for (let l=window.groundEyes/2; l>0; l--) {
				// 	tester = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
				// 	if (tester == -1) {
				// 		l--;
				// 		leftDisp = Math.abs((l+1)*GRSeparation-window.GRRange/2);
				// 		inputs[8] = leftDisp;
				// 		inputs[9] = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
				// 		break;
				// 	}
				// }

				// for (let l=window.groundEyes/2; l<window.groundEyes; l++) {
				// 	tester = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
				// 	if (tester == -1) {
				// 		l--;
				// 		rightDisp = Math.abs((l-1)*GRSeparation-window.GRRange/2);
				// 		inputs[10] = rightDisp;
				// 		inputs[11] = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
				// 		break;
				// 	}
				// }
				// let change = 360/(window.eyes);
				// for (let l=0; l<(window.eyes)*2; l++) {
				// 	//Clarification for beefy line of text:
				// 	//            1.                                  2.                                    3.                                                                                          4.        5.
				// 	inputs[12+l] = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((l*change)/180*Math.PI)*75), PPosY-(Math.sin((l*change)/180*Math.PI)*75))).distance || -1;
				// 	/*
				// 	1. the raycast function is used to determine the closest object to the player in the given vector. The parameters are defined in this for loop, namely the start and end points of the raycast.
				// 	2. Sets the starting point of the raycast (the input is a vector, and therefore uses the b2Vec2 class :) ).
				// 	3. Alright, this will require a bit of explanation. So, to clarify, the goal of this third input into the raycast function is to define the end point of the raycast.
				// 	In order to do this, we use the sine and cosine methods to determine the length of the line as the raycasts are projected to the sides of the player.
				// 	The change variable is going to be the rate of change required per l in terms of the angle to revolve around the player precisely one time.
				// 	Unfortunately, the cosine method uses radians, not degrees, so we simply convert from degrees to radians by dividing by 180 and multipling by PI.
				// 	We then multiply the Math.cos method by the length we want the line to be, since we're defining the end point of the raycast. This is also done with Math.sin.
				// 	And of course, since we want to stay centered around the player, we're adding onto the x and y position of the player.
				// 	4. The .distance value is the distance from the closest shape (if any) from the given parameters into the raycast function.
				// 	5. The raycast function may return false (if no shape is intersected by the raycast), and if that's the case, 0 is returned as the input.
				// 	*/
				// }
			}

			let output = this.brain.predict(inputs);
		  	if (output[0] < (0.5)) {
				window.down[i] = true;
			} else if (output[0] > (0.5)) {
				window.up[i] = true;
			}
		  	if (output[1] < (0.5)) {
				window.left[i] = true;
			} else if (output[1] > (0.5)) {
				window.right[i] = true;
			}
		  	if (0.5 < output[2]) {
				window.heavy[i] = true;
			}
			for(let m=0; m<window.eyes; m++) {
				this.lastOutputs[m]=output[3+m];
			}
		}
	  
		// update() {
		//   this.score++;
		// }
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
				//   values[j] = (Math.abs(w) > 0) ? (w + randn_bm()*w) : w + randn_bm()+0.5;
				  values[j] = w + (randn_bm(false));
				  if (values[j]<-2) {values[j]=-2}
				  if (values[j]>2) {values[j]=2}
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
						activation: 'selu',
					});
					model.add(hidden);
				} else if (i%2 == 0) {
					let hidden = tf.layers.dense({
						units: this.hidden_nodes[i],
						activation: 'selu',
					});
					model.add(hidden);
				} else {
					let hidden = tf.layers.dense({
						units: this.hidden_nodes[i],
						activation: 'selu',
					});
					model.add(hidden);
				}
			}
			const output = tf.layers.dense({
				units: this.output_nodes,
				activation: 'sigmoid'
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
		// NNs[0][i] = new NN();
		// if (controlPlayer1) {
		// 	NNs[1][i] = new NN();
		// }
		NNs[i] = new NN();
	  }
		// console.log(NNs);
	
	
	function nextGeneration() {
		// console.log('next generation');
		calculateFitness();
		for (let i = 0; i < TOTAL; i++) {
		//   NNs[0][i] = pickOne(0, i);
		//   if (controlPlayer1) {
		//   	NNs[1][i] = pickOne(1, i);
		//   }
		NNs[i] = pickOne(i);
		}
		// for (let i = 0; i < TOTAL; i++) {
		// 	savedNNs[0][i].dispose();
		// 	if (controlPlayer1) {
		// 		savedNNs[1][i].dispose();
		// 	}
		// }
		savedNNs = [];
	  }
	  
	  function pickOne(pos) {
		let index = 0;
		let r = Math.random();
		// let r = randn_bm(true);
		// console.log(savedNNs);
		while (r > 0) {
			// console.log(savedNNs[i][index].fitness); 
			// console.log(r);
			r = r - NNFitnesses[index];
		  index++;
		}
		index--;
		let child;
		if (pos == 0) {
			let NeuralN;
			NeuralN = savedNNs[winnerList[0]];
			child = NeuralN;
		} else if (pos == (TOTAL) && window.prevWinner != undefined && TOTAL > 2) {
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
            c.fillText("score: red - "+window.scores[0]+" - blue - "+window.scores[1], 250, 15);
            c.fillText("current reward (Player1): "+Math.round(reward2*1000)/1000, 5, 45);
            c.fillText("current reward (Player2): "+Math.round(reward*1000)/1000, 5, 60);
            c.fillText("generation : "+generation, 250, 30);
            c.fillText("current match : Network #" + winnerList[currentNN]+" VS Network #"+winnerList[currentNN+1],250, 45);
			if (window.debug) {
				let PPosX = window.Player2.GetPosition().x;
                let PPosY = window.Player2.GetPosition().y;
                for (let l=0; l<(window.eyes); l++) {
                    let distVal = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.sin(l+eyeRotation[1][l])*200), PPosY-(Math.cos(l+eyeRotation[1][l])*200))).distance || null;
                    c.fillText(Math.round(distVal), (PPosX*11.5) + PPosX+(Math.sin(l+eyeRotation[1][l])*distVal*11.5) , ((PPosY*-12.8)+600) + PPosY+(Math.cos(l+eyeRotation[1][l])*distVal*11.5));
                }
				
				for (let i = 0; i < NNScores.length; i+=2) {
					if (NNScores[i]>NNScores[i+1]) {
						c.fillStyle = "rgb("+(0)+","+(180)+","+(0)+")"; //green
					}
					if (NNScores[i]<NNScores[i+1]) {
						c.fillStyle = "rgb("+(180)+","+(0)+","+(0)+")"; //red
					}
					if (NNScores[i]== 0 && NNScores[i+1] == 0) {
						c.fillStyle = "rgb("+(0)+","+(0)+","+(0)+")";  //black
					}
					if (winnerList[currentNN]==i || winnerList[currentNN+1]==i){
						c.fillStyle = "rgb("+(80)+","+(80)+","+(255)+")"; //blue
					}
					c.fillText("NNscores[" + (i) + "]: " + NNScores[i],5,115+i/2*10);//currentNN
				}
				c.fillText("currentNN : "+currentNN, 250, 60);
				c.fillText("winnerList[currentNN] : "+winnerList[currentNN], 250, 70);
				for (let i = 0; i < NNScores.length; i+=2) {
					if (NNScores[i+1]>NNScores[i]) {
						c.fillStyle = "rgb("+(0)+","+(180)+","+(0)+")"; //green
					}
					if (NNScores[i]>NNScores[i+1]) {
						c.fillStyle = "rgb("+(180)+","+(0)+","+(0)+")"; //red
					}
					if (NNScores[i]== 0 && NNScores[i+1] == 0) {
						c.fillStyle = "rgb("+(0)+","+(0)+","+(0)+")";  //black
					}
					if (winnerList[currentNN]==i+1 || winnerList[currentNN+1]==i+1){
						c.fillStyle = "rgb("+(80)+","+(80)+","+(255)+")"; //blue
					}
					c.fillText("NNscores[" + (i+1) + "]: " + NNScores[i+1],205,115+i/2*10);
				}
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

			c.fillText("Game: "+(TOTAL-winnerList.length+1) + " of " + (TOTAL-1), 5, 90);
            c.fillText("Round: "+(round+1) + " of " + roundCap, 5, 105);
	
			c.fillText("speed:" + supaSpeed,5, 30);
			if(this._paused) {
				c.fillText("paused", 5, 15);
			} else {
				c.fillText("FPS: " + this._fpsAchieved, 5, 15);
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
		var lastOutputs=[];
		for (let i=0; i<window.eyes; i++) {
			lastOutputs[i]=0.5;
		}
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
				if (window.Player1.GetPosition().x < -40 || window.Player1.GetPosition().x > 100 || window.Player1.GetPosition().y < 0 || window.Player1.GetPosition().y > 200 || p1Lead <=-leadTolerance) {
					//if red is offscreen
					if (!window.testingMode) {
						reward  += 10; //blue's reward
						reward2 -= 10; //red's reward
					}
					this.endGame(1);
					break;
				} else if (window.Player2.GetPosition().x < -40 || window.Player2.GetPosition().x > 100 || window.Player2.GetPosition().y < 0 || window.Player2.GetPosition().y > 200 || p2Lead <=-leadTolerance) {
					//if blue is offscreen
					if (!window.testingMode) {
						reward  -= 10; //blue's reward
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
					NNs[index].think(0);
					if (controlPlayer1) {

						NNs[index2].think(1);
					}
				} else if (window.testModel != undefined) {
					let inputs = [];
					let color = "blue";
					if (color == "red") {
						inputs[0] = Math.max(Math.min((window.Player1.GetLinearVelocity().x/velocityRange), -1), 1);
						inputs[1] = Math.max(Math.min((window.Player1.GetLinearVelocity().y/velocityRange), -1), 1);
						inputs[2] = Math.max(Math.min((window.Player2.GetLinearVelocity().x/20), -1), 1);
						inputs[3] = Math.max(Math.min((window.Player2.GetLinearVelocity().y/20), -1), 1);
						inputs[4] = strengths[0]/10;
						inputs[5] = strengths[1]/10;
						inputs[6] = Math.max(Math.min(((window.Player1.GetPosition().x-window.Player2.GetPosition().x)/eyeRange), 1), -1);
						inputs[7] = Math.max(Math.min(((window.Player1.GetPosition().y-window.Player2.GetPosition().y)/eyeRange), 1), -1);
						let PPosX = window.Player1.GetPosition().x;
						let PPosY = window.Player1.GetPosition().y;
						// let GRSeparation = window.GRRange/window.groundEyes;
						// let tester;
						// let leftDisp = 0;
						// let rightDisp = 0;
						for(let m=0; m<window.eyes; m++) {
							inputs[8+m] = lastOutputs[m];
						}
		
						// let change = 360/(window.eyes)/180*Math.PI;
						for (let m=0; m<window.eyes; m++) {
							eyeRotation[0][m] = (lastOutputs[m]*2-1.5+1*m%2)*Math.PI;
							inputs[8+lastOutputs.length+m] = (raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((eyeRotation[0][m]))*eyeRange), PPosY-(Math.sin((eyeRotation[0][m]))*eyeRange))).distance || -eyeRange)/eyeRange;
						}

						// inputs[11] = 0.5;
						// for (let l=window.groundEyes/2; l>0; l--) {
						// 	tester = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
						// 	if (tester == -1) {
						// 		l--;
						// 		leftDisp = Math.abs((l+1)*GRSeparation-window.GRRange/2);
						// 		inputs[8] = leftDisp;
						// 		inputs[9] = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
						// 		break;
						// 	}
						// }
		
						// for (let l=window.groundEyes/2; l<window.groundEyes; l++) {
						// 	tester = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
						// 	if (tester == -1) {
						// 		l--;
						// 		rightDisp = Math.abs((l-1)*GRSeparation-window.GRRange/2);
						// 		inputs[10] = rightDisp;
						// 		inputs[11] = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
						// 		break;
						// 	}
						// }
						// console.log(inputs[8]);
						// console.log(inputs[9]);
						// console.log(inputs[10]);
						// console.log(inputs[11]);
						// inputs[8] = raycast(window.FloorFixture, new b2Vec2(PPosX+5, PPosY), new b2Vec2(PPosX+5, PPosY-75)).distance || -1;
						// inputs[9] = raycast(window.FloorFixture, new b2Vec2(PPosX-5, PPosY), new b2Vec2(PPosX-5, PPosY-75)).distance || -1;
						// let change = 360/(window.eyes);
						// for (let l=0; l<(window.eyes)*2; l++) {
						// 	inputs[12+l] = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((l*change)/180*Math.PI)*75), PPosY-(Math.sin((l*change)/180*Math.PI)*75))).distance) || 1;
						// }
					} else {
						inputs[0] = Math.max(Math.min((window.Player2.GetLinearVelocity().x/velocityRange), -1), 1);
						inputs[1] = Math.max(Math.min((window.Player2.GetLinearVelocity().y/velocityRange), -1), 1);
						inputs[2] = Math.max(Math.min((window.Player1.GetLinearVelocity().x/20), -1), 1);
						inputs[3] = Math.max(Math.min((window.Player1.GetLinearVelocity().y/20), -1), 1);
						inputs[4] = strengths[1]/10;
						inputs[5] = strengths[0]/10;
						inputs[6] = Math.max(Math.min(((window.Player2.GetPosition().x-window.Player1.GetPosition().x)/eyeRange), 1), -1);
						inputs[7] = Math.max(Math.min(((window.Player2.GetPosition().y-window.Player1.GetPosition().y)/eyeRange), 1), -1);
						let PPosX = window.Player2.GetPosition().x;
						let PPosY = window.Player2.GetPosition().y;
		
						// let p1Direction = Math.atan2(window.Player1.GetLinearVelocity().y,window.Player1.GetLinearVelocity().x) * (180/Math.PI);//p1 direction of momentum
						// let p1Speed = Math.sqrt(Math.pow(window.Player1.GetLinearVelocity().x,2)+Math.pow(window.Player1.GetLinearVelocity().y,2)); //p1 speed
						// let change = (180-(p1Speed*5))/(window.eyes); // makes the change value to half a circle, minus the player's speed * 5. (allowing for it to shrink dynamically as it goes faster.)
						// for (let l=Math.ceil(window.eyes*-.5); l<Math.floor(window.eyes/2); l++) {
						//   //here we will probably want the window.eyes var to be odd, so that it can see directly infront of it's momentum.
						//   //We can quickly see how this works with window.eyes = 7;  7*-.5 = -3.5, ceil(-3.5) == -3, looping -3 to 3. < this is our offset from our stored p1Direction var.
						//   inputs[8+l] = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((p1Direction+l)/180*Math.PI)*75), PPosY-(Math.sin((p1Direction+l)/180*Math.PI)*75))).distance || -1; //now it will loop through while using it's direction - the offset from the for-loop variable, which dynamically increases in magnitude, as speed increases.
						// }
		
						let GRSeparation = window.GRRange/window.groundEyes;
						let tester;
						let leftDisp = 0;
						let rightDisp = 0;
		
						for(let m=0; m<window.eyes; m++) {
							inputs[8+m] = lastOutputs[m];
						}
		
						// let change = 360/(window.eyes)/180*Math.PI;
						for (let m=0; m<window.eyes; m++) {
							eyeRotation[1][m] = (lastOutputs[m]*2-1.5+1*m%2)*Math.PI;
							inputs[8+lastOutputs.length+m] = (raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((eyeRotation[1][m]))*eyeRange), PPosY-(Math.sin((eyeRotation[1][m]))*eyeRange))).distance || -eyeRange)/eyeRange;
						}
						
						// inputs[11] = 0.5;
						// for (let l=window.groundEyes/2; l>0; l--) {
						// 	tester = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
						// 	if (tester == -1) {
						// 		l--;
						// 		leftDisp = Math.abs((l+1)*GRSeparation-window.GRRange/2);
						// 		inputs[8] = leftDisp;
						// 		inputs[9] = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
						// 		break;
						// 	}
						// }
		
						// for (let l=window.groundEyes/2; l<window.groundEyes; l++) {
						// 	tester = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
						// 	if (tester == -1) {
						// 		l--;
						// 		rightDisp = Math.abs((l-1)*GRSeparation-window.GRRange/2);
						// 		inputs[10] = rightDisp;
						// 		inputs[11] = raycast(window.FloorFixture, new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY), new b2Vec2(PPosX+(l*GRSeparation)-window.GRRange/2, PPosY-75)).distance || -1;
						// 		break;
						// 	}
						// }
						// let change = 360/(window.eyes);
						// for (let l=0; l<(window.eyes)*2; l++) {
						// 	//Clarification for beefy line of text:
						// 	//            1.                                  2.                                    3.                                                                                          4.        5.
						// 	inputs[12+l] = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((l*change)/180*Math.PI)*75), PPosY-(Math.sin((l*change)/180*Math.PI)*75))).distance || -1;
						// 	/*
						// 	1. the raycast function is used to determine the closest object to the player in the given vector. The parameters are defined in this for loop, namely the start and end points of the raycast.
						// 	2. Sets the starting point of the raycast (the input is a vector, and therefore uses the b2Vec2 class :) ).
						// 	3. Alright, this will require a bit of explanation. So, to clarify, the goal of this third input into the raycast function is to define the end point of the raycast.
						// 	In order to do this, we use the sine and cosine methods to determine the length of the line as the raycasts are projected to the sides of the player.
						// 	The change variable is going to be the rate of change required per l in terms of the angle to revolve around the player precisely one time.
						// 	Unfortunately, the cosine method uses radians, not degrees, so we simply convert from degrees to radians by dividing by 180 and multipling by PI.
						// 	We then multiply the Math.cos method by the length we want the line to be, since we're defining the end point of the raycast. This is also done with Math.sin.
						// 	And of course, since we want to stay centered around the player, we're adding onto the x and y position of the player.
						// 	4. The .distance value is the distance from the closest shape (if any) from the given parameters into the raycast function.
						// 	5. The raycast function may return false (if no shape is intersected by the raycast), and if that's the case, 0 is returned as the input.
						// 	*/
						// }
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
					if (output[0] < (0.5)) {
						window.down[1] = true;
					} else if (output[0] > (0.5)) {
						window.up[1] = true;
					}
				  	if (output[1] < (0.5)) {
						window.left[1] = true;
					} else if (output[1] > (0.5)) {
						window.right[1] = true;
					}
					if (0.5 < output[2]) {
						window.heavy[1] = true;
					}
					for(let m=0; m<window.eyes; m++) {
						lastOutputs[m]=output[3+m];
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
				//this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);
			
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
			// NNScores[0].push(i);
			// NNScores[1].push(i);
			NNScores.push(0);
		}
		var NNFitnesses = [];
	
		Test.prototype.endGame = function (winner) {
			if (!window.testingMode) {
				round++;

				//Varies the level every single round instead of at the end of a tournament.
				window.level++;
				if (window.level >= window.runners.length) {window.level = 0;}
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
						NNScores[index2] += (Math.floor(Math.log2(TOTAL))-Math.floor(Math.log2(winnerList.length)))*10;
						if (winnerList.length == 2) {secondBest = NNs[index];}
						winnerList.splice(currentNN, 1);
					} else {
						NNScores[index] += (Math.floor(Math.log2(TOTAL))-Math.floor(Math.log2(winnerList.length)))*10;
						if (winnerList.length == 2) {secondBest = NNs[index2];}
						winnerList.splice(currentNN+1, 1);
					}
					reward = 0;
					reward2 = 0;
				} else if (!window.testingMode) {
					window.scores[winner]++;
				}
				
				if (window.saveRedNN) {
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
						NNScores[winnerList[0]] += Math.log2(TOTAL)*10;
						if (window.saveTourneyWinner == true) {
							NNs[winnerList[0]].brain.model.save("localstorage://savedModel");
							window.saveTourneyWinner = false;
						}
						window.prevWinner = window.winner;
						window.winner = winnerList[0];
						generation++;
						// NNScores[Math.floor(winnerList[0]/TOTAL)][winnerList[0]] += TOTAL; //large reward for tournament winner.
						savedNNs = [...NNs];
						NNScores = quickSort(NNScores);
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
						// window.level++;
						// if (window.level >= window.runners.length) {window.level = 0;}
					}
				}
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
	