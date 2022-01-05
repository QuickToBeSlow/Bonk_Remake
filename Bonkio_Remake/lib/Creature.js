/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT

	Edited by Blake Meyer at 1/1/2022
*/

let Network = require('./Network.js');

function Creature(model) {
	this.network = new Network(model); // Init the network

	this.fitness = 0;
	this.score = 0;

	this.flattenGenes = function () { // Flattens the genes of the creature's genes and returns them as an array.
		let genes = [];

		for (let i = 0; i < this.network.layers.length - 1; i++) {
			for (let w = 0; w < this.network.layers[i].nodes.length; w++) {
				for (let e = 0; e < this.network.layers[i].nodes[w].weights.length; e++) {
					genes.push(this.network.layers[i].nodes[w].weights[e]);
				}
			}

			for (let w = 0; w < this.network.layers[i].bias.weights.length; w++) {
				genes.push(this.network.layers[i].bias.weights[w]);
			}
		}

		return genes;
	}

	this.setFlattenedGenes = function (genes) { // Sets an array of weights as the creature's genes.
		for (let i = 0; i < this.network.layers.length - 1; i++) {
			for (let w = 0; w < this.network.layers[i].nodes.length; w++) {
				for (let e = 0; e < this.network.layers[i].nodes[w].weights.length; e++) {
					this.network.layers[i].nodes[w].weights[e] = genes[0];
					genes.splice(0, 1);
				}
			}

			for (let w = 0; w < this.network.layers[i].bias.weights.length; w++) {
				this.network.layers[i].bias.weights[w] = genes[0];
				genes.splice(0, 1);
			}
		}
	}

	this.feedForward = function () { // Feeds forward the creature's network.
		this.network.feedForward();
	}

	this.setInputs = function (inputs) { // Sets the inputs of the creature.
		this.network.layers[0].setValues(inputs);
	}

	this.desicion = function () { // Some spaghetti code that returns the desicion of the creature. For SOFTMAX outputs.
		let index = -1; 
		let max = -Infinity;
		for (let i = 0; i < this.network.layers[this.network.layers.length - 1].nodes.length; i++) {
			if (this.network.layers[this.network.layers.length - 1].nodes[i].value > max) {
				max = this.network.layers[this.network.layers.length - 1].nodes[i].value;
				index = i;
			}
		}
		return index;
	}

	//Added by Blake, allows for multiple decisions to be made.
	this.multiDecision = function () {
		let indexes = [];
		for (let i = 0; i < this.network.layers[this.network.layers.length - 1].nodes.length; i++) {
			if (this.network.layers[this.network.layers.length - 1].nodes[i].value > 0.5) {
				indexes.push(i);
			}
		}
		return indexes;
	}

	//WIP
	let mutate = { // Mutation function (More to come!).
		RANDOM: function (genes, mutationRate) { // Randomly sets the weights to a completely random value.
			for (let i = 0; i < genes.length; i++) {
				if (Math.random() < mutationRate) genes[i] = (Math.random() * 2) - 1;
			}
			return genes;
		}
	}
	
	this.mutationMethod = mutate.RANDOM;

	this.mutate = function () { // Parses every creature's genes passes them to the mutation function and sets their new (mutated) genes.
		let genes = this.flattenGenes();
		genes = this.mutationMethod(genes, this.mutationRate);
		this.setFlattenedGenes(genes);
	}

	this.crossover = function () { // Takes two creature's genes flattens them and passes them to the crossover function.
		for (let i = 0; i < this.populationSize; i++) {
			this.oldCreatures = Object.assign([], this.creatures);
			let parentx = this.pickCreature();
			let parenty = this.pickCreature();

			let genes = this.crossoverMethod(parentx.flattenGenes(), parenty.flattenGenes());
			this.creatures[i].setFlattenedGenes(genes);
		}
	}

	this.output = function(i, p1, p2) {
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
			inputs[8+m] = this.lastOutputs[m];
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

	this.think = function(i) {
		let inputs = (i==0) ? this.output(i, window.Player1, window.Player2) : this.output(i, window.Player2, window.Player1);

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
}

module.exports = Creature;