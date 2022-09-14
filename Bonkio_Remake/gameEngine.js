//Current notes:
//turn away from tensorflow.js completely (since we're using NEAT), and use JSON.stringify() and JSON.parse()
//to save and read the data.

(function(){




	var activationsNames = ["Sigmoid", "Identity", "Step", "Tanh", "ReLu"];

	//The Node Class
	class Node {
		constructor(num, lay, isOutput) {
			this.number = num;
			this.layer = lay;
			this.activationFunction = Math.floor(Math.random() * 5); //Number between 0 and 4
			this.bias = Math.random() * 2 - 1;
			this.output = isOutput || false; //is this node an Output node?
	
			this.inputSum = 0;
			this.outputValue = 0;
			this.outputConnections = [];
		}
	
		engage() { //Pass down the network the calculated output value
			if (this.layer != 0) //No activation function on input nodes
				this.outputValue = this.activation(this.inputSum + this.bias);
	
	
			this.outputConnections.forEach((conn) => {
				if (conn.enabled) //Do not pass value if connection is disabled
					conn.toNode.inputSum += conn.weight * this.outputValue; //Weighted output sum
			});
		}
	
		mutateBias() { //Randomly mutate the bias of this node
			let rand = Math.random();
			if (rand < 0.05) //5% chance of being assigned a new random value
				this.bias = Math.random() * 2 - 1;
			else //95% chance of being uniformly perturbed
				this.bias += randn_bm() / 50;
		}
	
		mutateActivation() { //Randomly choose a new activationFunction
			this.activationFunction = Math.floor(Math.random() * 5); //Number between 0 and 4
		}
	
		isConnectedTo(node) { //Check if two nodes are connected
			if (node.layer == this.layer) //nodes in the same layer cannot be connected
				return false;
	
	
			if (node.layer < this.layer) { //Check parameter node connections
				node.outputConnections.forEach((conn) => {
					if (conn.toNode == this) //Is Node connected to This?
						return true;
				});
			} else { //Check this node connections
				this.outputConnections.forEach((conn) => {
					if (conn.toNode == node) //Is This connected to Node?
						return true;
				});
			}
	
			return false;
		}
	
		clone() { //Returns a copy of this node
			let node = new Node(this.number, this.layer, this.output);
			node.bias = this.bias; //Same bias
			node.activationFunction = this.activationFunction; //Same activationFunction
			return node;
		}
	
		activation(x) { //All the possible activation Functions
			switch (this.activationFunction) {
				case 0: //Sigmoid
					return 1 / (1 + Math.pow(Math.E, -4.9 * x));
					break;
				case 1: //Identity
					return x;
					break;
				case 2: //Step
					return x > 0 ? 1 : 0;
					break;
				case 3: //Tanh
					return Math.tanh(x);
					break;
				case 4: //ReLu
					return x < 0 ? 0 : x;
					break;
				default: //Sigmoid
					return 1 / (1 + Math.pow(Math.E, -4.9 * x));
					break;
			}
		}
	}



	//2
	//The Genome Class

class Genome {
	constructor(inp, out, offSpring = false, nodes = null, connections = null) {
		
		//from other method
		this.lastOutputs=[];
		for (let i=0; i<window.eyes; i++) {
			this.lastOutputs[i]=0.5;
		}
		//end

		//if inputs are defined, then proceed as normal. If not, create new neural network.
		  if (inp==null || out==null) {
			inp = 8+this.lastOutputs.length+(window.eyes*2)+window.groundEyes*2;
			out = 3+this.lastOutputs.length;
		  }

		this.inputs = inp; //Number of inputs
		this.outputs = out; //Number of outputs
		this.layers = 2;
		this.nextNode = 0;

		if (nodes != null) {
			this.nodes = nodes;
		} else {
			this.nodes = [];
		}
		if (connections != null) {
			this.connections = connections;
		} else {
			this.connections = [];
		}

		this.offSpring = true;
		if(!offSpring) { //This is not an offspring genome generate a fullyConnected net
			if (nodes != null && nodes.length!=0) {
				return;
			}
			for (let i = 0; i < this.inputs; i++) {
				this.nodes.push(new Node(this.nextNode, 0));
				this.nextNode++;
			}

			for (let i = 0; i < this.outputs; i++) {
				let node = new Node(this.nextNode, 1, true);
				this.nodes.push(node);
				this.nextNode++;
			}


			for (let i = 0; i < this.inputs; i++) {
				for (let j = this.inputs; j < this.outputs + this.inputs; j++) {
					let weight = Math.random() * this.inputs * Math.sqrt(2 / this.inputs);
					this.connections.push(new Connection(this.nodes[i], this.nodes[j], weight));
				}
			}
		}
	}

	//Network Core
	generateNetwork() {
		//Clear all outputConnections in the nodes
		this.nodes.forEach((node) => {
			node.outputConnections.splice(0, node.outputConnections.length);
		});

		//Add the connections to the Nodes
		this.connections.forEach((conn) => {
			conn.fromNode.outputConnections.push(conn);
		});

		//Prepare for feed forward
		this.sortByLayer();
	}
		output(i, p1, p2) {
			let inputs = [];
			// inputs[0] = Math.atan(p1.GetPosition().x/p1.GetPosition().y)+(Math.random()-0.5)*noise;
			// inputs[1] = Math.max(Math.min((Math.sqrt(Math.pow(p1.GetLinearVelocity().x, 2) + Math.pow(p1.GetLinearVelocity().y, 2))), 1), -1)/velocityRange+(Math.random()-0.5)*noise;

			// inputs[2] = Math.atan(p2.GetPosition().x/p2.GetPosition().y)+(Math.random()-0.5)*noise;
			// inputs[3] = Math.max(Math.min((Math.sqrt(Math.pow(p2.GetLinearVelocity().x, 2) + Math.pow(p2.GetLinearVelocity().y, 2))), 1), -1)/velocityRange+(Math.random()-0.5)*noise;

			inputs[0] = Math.max(Math.min((p1.GetLinearVelocity().x/velocityRange), 1), -1)+(Math.random()-0.5)*noise;
			inputs[1] = Math.max(Math.min((p1.GetLinearVelocity().y/velocityRange), 1), -1)+(Math.random()-0.5)*noise;
			inputs[2] = Math.max(Math.min((p2.GetLinearVelocity().x/velocityRange), 1), -1)+(Math.random()-0.5)*noise;
			inputs[3] = Math.max(Math.min((p2.GetLinearVelocity().y/velocityRange), 1), -1)+(Math.random()-0.5)*noise;
			inputs[4] = strengths[i]/10+(Math.random()-0.5)*noise;
			inputs[5] = strengths[(1-i)]/10+(Math.random()-0.5)*noise;
			inputs[6] = Math.max(Math.min(((p1.GetPosition().x-p2.GetPosition().x)/posRange), 1), -1)+(Math.random()-0.5)*noise;
			inputs[7] = Math.max(Math.min(((p1.GetPosition().y-p2.GetPosition().y)/posRange), 1), -1)+(Math.random()-0.5)*noise;
			let PPosX = p1.GetPosition().x;
			let PPosY = p1.GetPosition().y;
			for(let m=0; m<window.eyes; m++) {
				if (Number.isFinite(this.lastOutputs[m]))
					inputs[8+m] = Math.max(Math.min(this.lastOutputs[m], 1), -1);
				else {
					inputs[8+m] = 0.5;
					this.lastOutputs[m] = 0.5;
				}
			}

			// let change = 360/(window.eyes)/180*Math.PI;
			for (let m=0; m<window.eyes; m++) {
				// eyeRotation[0][m] = (this.lastOutputs[m]*2-1.5+1*m%2)*Math.PI;
				eyeRotation[i][m] = 2*(this.lastOutputs[m]*2-1)*Math.PI-Math.PI/2;
				let cast = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX+(Math.cos((eyeRotation[i][m]))*eyeRange), PPosY-(Math.sin((eyeRotation[i][m]))*eyeRange)));
				inputs[8+this.lastOutputs.length+m] = (cast.distance || -eyeRange)/eyeRange+(Math.random()-0.5)*noise;
				inputs[8+this.lastOutputs.length+m+window.eyes] = cast.angle+(Math.random()-0.5)*noise || 0;
			}
			// let GRSeparation = window.GRRange/window.groundEyes;
			// let tester;
			// let leftDisp = 0;
			// let rightDisp = 0;

			let cast = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX, PPosY-eyeRange));
			inputs[8+this.lastOutputs.length+window.eyes*2] = (cast.distance || -eyeRange)/eyeRange+(Math.random()-0.5)*noise;
			inputs[8+this.lastOutputs.length+window.eyes*2+1] = cast.angle+(Math.random()-0.5)*noise || 0;
			return inputs;
		}

		think(i) {
			let inputs = (i==0) ? this.output(i, window.Player1, window.Player2) : this.output(i, window.Player2, window.Player1);

			let output = this.feedForward(inputs);
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
	
	feedForward(inputValues) {
		this.generateNetwork(); //Connect all up

		//Clear old inputs
		this.nodes.forEach((node) => { node.inputSum = 0; });

		//assign new inputs
		for (let i = 0; i < this.inputs; i++)
			this.nodes[i].outputValue = inputValues[i];

		//Engage all nodes and Extract the results from the outputs
		let result = [];
		this.nodes.forEach((node) => {
			if (node.layer != 0) //No activation function on input nodes
				node.outputValue = node.activation(node.inputSum + node.bias);


			node.outputConnections.forEach((conn) => {
				if (conn.enabled) //Do not pass value if connection is disabled
					conn.toNode.inputSum += conn.weight * node.outputValue; //Weighted output sum
			});

			if (node.output)
				result.push(node.outputValue);
		});
		return result;
	}


	//Crossover
	crossover(partner) {
		//TODO: find a good way to generate unique ids
		let offSpring = new Genome(this.inputs, this.outputs, false); //Child genome
		offSpring.nextNode = this.nextNode;

		offSpring.nodes = [];
		offSpring.connections = [];
		//Take all nodes from this parent - output node activation 50%-50%
		for(let i = 0; i < this.nodes.length; i++){
			let node = this.nodes[i].clone();
			if(node.output) {
				let partnerNode = partner.nodes[partner.getNode(node.number)];
				if(Math.random() > 0.5) {
					node.activationFunction = partnerNode.activationFunction;
					node.bias = partnerNode.bias;
				}
			}
			offSpring.nodes.push(node);
		}

		//Randomly take connections from this or the partner network
		let maxLayer = 0;
		for(let i = 0; i < this.connections.length; i++) {
			let index = this.commonConnection(this.connections[i].getInnovationNumber(), partner.connections);

			if(index != -1) { //There is a commonConnection
				let conn = Math.random() > 0.5 ? this.connections[i].clone() : partner.connections[index].clone();

				//Reassign nodes
				let fromNode = offSpring.nodes[offSpring.getNode(conn.fromNode.number)];
				let toNode = offSpring.nodes[offSpring.getNode(conn.toNode.number)];
				conn.fromNode = fromNode;
				conn.toNode = toNode;

				//Add this connection to the child
				if(fromNode && toNode)
					offSpring.connections.push(conn);
			}
			else { //No common connection -> take from this
				let conn = this.connections[i].clone();

				//Reassign nodes
				let fromNode = offSpring.nodes[offSpring.getNode(conn.fromNode.number)];
				let toNode = offSpring.nodes[offSpring.getNode(conn.toNode.number)];
				conn.fromNode = fromNode;
				conn.toNode = toNode;

				//Add this connection to the child
				if(fromNode && toNode)
					offSpring.connections.push(conn);
			}
		}

		offSpring.layers = this.layers;
		return offSpring;
	}



	//Mutation Stuff
	mutate() {
		//console.log("Mutation...");
		let mut;

		if(Math.random() < 0.8) { //80%
			//MOD Connections
			mut = "ModConn";
			//let i = Math.floor(Math.random() * this.connections.length);
			//this.connections[i].mutateWeight();
			for (var i = 0; i < this.connections.length; i++) {
				this.connections[i].mutateWeight();
			}
		}

		if(Math.random() < 0.5) { //50%
			//MOD Bias
			mut = "ModBias";
			//let i = Math.floor(Math.random() * this.nodes.length);
			//this.nodes[i].mutateBias();
			for (var i = 0; i < this.nodes.length; i++) {
				this.nodes[i].mutateBias();
			}
		}

		if(Math.random() < 0.1) { //10%
			//MOD Node
			mut = "ModAct";
			let i = Math.floor(Math.random() * this.nodes.length);
			this.nodes[i].mutateActivation();
		}

		if(Math.random() < 0.05) { //5%
			//ADD Connections
			mut = "AddConn";
			this.addConnection();
		}

		if(Math.random() < 0.01) { //1%
			//ADD Node
			mut = "AddNode";
			this.addNode();
		}
	}

	addNode() { //Add a node to the network
		//Get a random connection to replace with a node
		let connectionIndex = Math.floor(Math.random() * this.connections.length);
		let pickedConnection = this.connections[connectionIndex];
		pickedConnection.enabled = false;
		this.connections.splice(connectionIndex, 1); //Delete the connection

		//Create the new node
		let newNode = new Node(this.nextNode, pickedConnection.fromNode.layer + 1);
		this.nodes.forEach((node) => { //Shift all nodes layer value
			if (node.layer > pickedConnection.fromNode.layer)
				node.layer++;
		});

		//New connections
		let newConnection1 = new Connection(pickedConnection.fromNode, newNode, 1);
		let newConnection2 = new Connection(newNode, pickedConnection.toNode, pickedConnection.weight);

		this.layers++;
		this.connections.push(newConnection1); //Add connection
		this.connections.push(newConnection2); //Add connection
		this.nodes.push(newNode); //Add node
		this.nextNode++;
	}

	addConnection() { //Add a connection to the network
		if (this.fullyConnected())
			return; //Cannot add connections if it's fullyConnected

		//Choose to nodes to connect
		let node1 = Math.floor(Math.random() * this.nodes.length);
		let node2 = Math.floor(Math.random() * this.nodes.length);

		//Search for two valid nodes
		while (this.nodes[node1].layer == this.nodes[node2].layer
			|| this.nodesConnected(this.nodes[node1], this.nodes[node2])) {
			node1 = Math.floor(Math.random() * this.nodes.length);
			node2 = Math.floor(Math.random() * this.nodes.length);
		}

		//Switch nodes based on their layer
		if (this.nodes[node1].layer > this.nodes[node2].layer) {
			let temp = node1;
			node1 = node2;
			node2 = temp;
		}

		//add the connection
		let newConnection = new Connection(this.nodes[node1], this.nodes[node2], Math.random() * this.inputs * Math.sqrt(2 / this.inputs));
		this.connections.push(newConnection);
	}



	//Utilities
	commonConnection(innN, connections) {
		//Search through all connections to check for
		//one with the correct Innovation Number
		for(let i = 0; i < connections.length; i++){
			if(innN == connections[i].getInnovationNumber())
				return i;
		}

		//Found nothing
		return -1;
	}

	nodesConnected(node1, node2) {
		//Search if there is a connection between node1 & node2
		for (let i = 0; i < this.connections.length; i++) {
			let conn = this.connections[i];
			if ((conn.fromNode == node1 && conn.toNode == node2)
				|| (conn.fromNode == node2 && conn.toNode == node1)) {
				return true;
			}
		};

		return false;
	}

	fullyConnected() {
		//check if the network is fully connected
		let maxConnections = 0;
		let nodesPerLayer = [];

		//Calculate all possible connections
		this.nodes.forEach((node) => {
			if (nodesPerLayer[node.layer] != undefined)
				nodesPerLayer[node.layer]++;
			else
				nodesPerLayer[node.layer] = 1;
		});

		for (let i = 0; i < this.layers - 1; i++)
			for (let j = i + 1; j < this.layers; j++)
				maxConnections += nodesPerLayer[i] * nodesPerLayer[j];

		//Compare
		return maxConnections == this.connections.length;
	}

	sortByLayer(){
		//Sort all nodes by layer
		this.nodes.sort((a, b) => {
			return a.layer - b.layer;
		});
	}

	clone() { //Returns a copy of this genome
		let clone = new Genome(this.inputs, this.outputs);
		clone.nodes = this.nodes.slice(0, this.nodes.length);
		clone.connections = this.connections.slice(0, this.connections.length);

		return clone;
	}

	getNode(x){ //Returns the index of a node with that Number
		for(let i = 0; i < this.nodes.length; i++)
			if(this.nodes[i].number == x)
				return i;

		return -1;
	}

	calculateWeight() { //Computational weight of the network
		return this.connections.length + this.nodes.length;
	}
}


	//3
	//The Connection Class
//Is where all the weights are stored
//Mostly used for a cleaner and more readable code.
class Connection {
	constructor(from, to, weight){
		this.fromNode = from; //type: Node
		this.toNode = to; //type: Node
		this.weight = weight; //type: Number
		this.enabled = true;
	}

	mutateWeight(){ //Randomly mutate the weight of this connection
		let rand = Math.random();
		if (rand < 0.05) //5% chance of being assigned a new random value
			this.weight = Math.random() * 2 - 1;
		else //95% chance of being uniformly perturbed
			this.weight += randn_bm() / 50;
	}

	clone(){ //Returns a copy of this connection
		let clone = new Connection(this.fromNode, this.toNode, this.weight);
		clone.enabled = this.enabled;
		return clone;
	}

	getInnovationNumber(){ //Using https://en.wikipedia.org/wiki/Pairing_function#Cantor_pairing_function
		return (1/2)*(this.fromNode.number + this.toNode.number)*(this.fromNode.number + this.toNode.number + 1) + this.toNode.number;
	}
}













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
		}
	  }
	}

	if(closestShape != undefined && closestShape.RayCast(rayCastOutput, rayCastInput)){
		let norm = rayCastOutput.normal;
		return {
			normal: norm,
			angle: (Math.atan(norm.y/norm.x)/Math.PI*2+1.5)%2-0.5,
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
		// num = num;
		if (restrict == true) {
			num = num / 20;
			// if (num > 1 || num < -1) return randn_bm(true); // resample between 0 and 1
		}
		return num;
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
	window.eyes = 2;
	window.groundEyes = 1;
	window.GRRange = 0;
	window.debug = false;
	window.draw = true;
	window.noise = 0; // 5/100
	var eyeRange = 40;
	var posRange = 50;
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
	var roundCap = 15;
	var leadTolerance = 5;
	var currentNN = 0;
	window.TOTAL = 128;
	//Changed to use NEAT NNs.
	var NNs = [];
	var savedNNs = [];
	var winnerList = [];


	window.saveTourneyWinner = false;
	window.saveRedNN = false;
	window.saveBlueNN = false;
	// var secondBest;
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
		
	  tf.setBackend('cpu');

	  //Make new NEAT AIs.
	  for (let i = 0; i < TOTAL; i++) {
		NNs[i] = new Genome();
	  }	
	
	function nextGeneration() {
		calculateFitness();

		console.log(NNs);
		for (let i = 0; i < TOTAL; i++) {
			let NN1 = pickOne(i);
			let NN2 = pickOne(i);
			NN1 = NN1.crossover(NN2).clone();
			NNs[i] = NN1.clone();
		}

		//removes NNs if NNs array is larger than TOTAL.
		if (NNs.length>TOTAL) {
			let deleteNum = NNs.length-TOTAL;
			NNs.splice(TOTAL-1, deleteNum);
		}
		// for (let i = 0; i < TOTAL; i++) {
		// 	savedNNs[i] = null;
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
			let NeuralN = savedNNs[winnerList[0]].clone();
			child = NeuralN.clone();
		} else if (pos == (TOTAL) && window.prevWinner != undefined && TOTAL > 2) {
			let NeuralN = window.prevWinner.clone();
			child = NeuralN.clone();
		} else {
			let NeuralN = savedNNs[index].clone();
			NeuralN.mutate();
			child = NeuralN.clone();
		}
		return child.clone();
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
                    c.fillText(Math.round(distVal), (PPosX*11.5) + PPosX+(Math.sin(l+eyeRotation[1][l])*distVal*11.5) , ((PPosY*-12.5)+600) + PPosY+(Math.cos(l+eyeRotation[1][l])*distVal*11.5));
                }
				let distVal = raycast(window.FloorFixture, new b2Vec2(PPosX, PPosY), new b2Vec2(PPosX, PPosY-eyeRange)).distance || 0;
				c.fillText(Math.round(distVal), (PPosX*12.5) , ((PPosY*-12.5)+600) + (distVal*12.5));
				
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
					window.testModel.think(1);
				}

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
				// window.level = Math.round(Math.random()*(window.runners.length-1));
				// window.level = Math.round(Math.random()*(window.runners.length-2)+1);
			}
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
					window.testModel = NNs[index];
					// NNs[index].save("localstorage://savedModel");
					//NOT DONE YET!
					window.saveRedNN = false;
				}
				if (window.saveBlueNN) {
					window.testModel = NNs[index2];
					// NNs[index2].save("localstorage://savedModel");
					//NOT DONE YET!
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
							// NNs[winnerList[0]].brain.model.save("localstorage://savedModel");
							//NOT DONE YET!
							window.testModel = NNs[winnerList[0]];

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
		
		Test.prototype.makeNN = function(brain) {
			return new NN(brain);
		}

		Test.prototype.downloadModel = function(name) {
			const replacerFunc = () => {
				const visited = new WeakSet();
				return (key, value) => {
				  if (typeof value === "object" && value !== null) {
					if (visited.has(value)) {
					  return;
					}
					visited.add(value);
				  }
				  return value;
				};
			  };
			  
			let jsonModel = JSON.stringify(window.testModel, replacerFunc());
			//DOWNLOADS MODEL
			var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonModel);
			// console.log(data);
			console.log(jsonModel);
			// console.log(encodeURIComponent(JSON.stringify(data)));
			var dlAnchorElem = document.createElement("a");
			dlAnchorElem.setAttribute("href",     dataStr     );
			dlAnchorElem.setAttribute("download", name+".json");
			dlAnchorElem.click();
			dlAnchorElem.remove();
		}

		Test.prototype.loadModel = function(name) {

			let file = document.getElementById("file").files[0];
			let data;

			read = new FileReader();

			read.readAsText(file);

			read.onloadend = function(){
				console.log(read.result);
				data = JSON.parse(read.result);
				let dataConnections = [];
				let lastLength = 0;

				data.nodes = data.nodes.filter(function(e){return e}); 

				for (let i=0; i<data.nodes.length; i++) {
					// if (data.nodes[i]==null) continue;
					for (let j=0; j<data.nodes[i].outputConnections.length; j++) {
						dataConnections[lastLength+j];
					}
					lastLength += data.nodes[i].outputConnections.length;
				}
				data.connections = dataConnections;
				window.testModel = new Genome(data.inputs,data.outputs,false,data.nodes,data.connections);
				// window.testModel = data;
				console.log(window.testModel);
		}
	}

		window.gameEngine = Test;
			
		})();
	