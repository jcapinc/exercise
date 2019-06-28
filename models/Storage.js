const fs = require("fs");

const LineReader = require("./LineReader");
const Exercise = require("./Exercise");
const Superset = require("./Superset");

class Storage {
	constructor(){
		this.supersets = [];
		this.exercises = [];
	}

	addExercise(exercise){
		this.exercises.push(exercise);
		return this;
	}

	addSuperset(superset){
		this.supersets.push(superset);
		return this;
	}

	serialize(){
		return JSON.stringify({
			supersets:this.supersets,
			exercises:this.exercises
		});
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

	listExercises(){
		if(this.exercises.length === 0) console.log("No Exercises");
		return this.exercises.map((e,i) => console.log(`${i}: [${e.score}] ${e.name}`));
	}

	save(){
		return new Promise(( resolve, reject) => fs.writeFile("db.json",this.serialize(),err => {
			if(err) return reject(err);
			return resolve();
		}));
	}

	deleteExercise(key){
		const removed = this.exercises[key];
		this.exercises = this.exercises.filter((_,index) => index === key);
		return removed;
	}

	async deleteExerciseDialogue(){
		this.listExercises();
		const reader = new LineReader();
		const key = await reader.read(`Choose an exercise to delete by number [0-${this.exercises.length - 1}]> `);
		if(!this.exercises[key]){
			console.log("No exercise deleted.");
			return null;
		}
		const result = this.deleteExercise(key);
		this.listExercises();
		return result;
	}

	actions(){
		const actions = {
			list: function(){
				this.listExercises();
				return false;
			},
			save: function(){
				return this.save().then(() => null);
			},
			end:function(){
				return this.save().then(() => process.exit(0));
			},
			delete:function(){
				return this.deleteExerciseDialogue().then(() => null);
			},
			help: function(){
				return console.log(Object.keys(actions).join(", "));
			},
			update: function(){
				return this.updateExerciseDialogue().then(() => null);
			}
		};
		actions.exit = actions.end;
		return actions;
	}

	updateExerciseDialogue(){
		/// implement me
	}

	interuptor(){
		return name => {
			if(this.actions()[name]) return this.actions()[name].call(this);
		}
	}
}

module.exports = Storage;