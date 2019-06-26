const fs = require("fs");

const Exercise = require("./Exercise");
const Superset = require("./Superset");

class Storage {
	constructor(){
		this.supersets = [];
		this.exercises = [];
	}

	serialize(){
		return JSON.stringify(this);
	}

	deserialize(contents){
		const raw = JSON.parse(contents);
		if(typeof raw != "object") throw new Error("Unable to parse contents of incoming json: " + contents);
		raw.exercises.map(e => this.addExercise(Exercise.deserialize(e)));
		raw.supersets.map(s => this.addSuperset(Superset.deserialize(s)));
		return this;
	}

	async deserializeFile(path){
		const isFile = (await new Promise((resolve, reject) => fs.stat(path,(err,stat) => { 
			if(err) return reject(err);
			return resolve(stat)
		}))).isFile();

		if(!isFile) throw new Error(`${path} is not a file`);

		return this.deserialize(await new Promise((resolve,reject) => fs.readFile(path,(err,content) => {
			if(err) reject(err);
			return resolve(content);
		})));
	}

	addExercise(exercise){
		this.exercises.push(exercise);
		return this;
	}

	addSuperset(superset){
		this.supersets.push(superset);
		return this;
	}
}

module.exports = Storage;