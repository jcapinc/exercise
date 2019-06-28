const LineReader = require("./LineReader");
const reader = new LineReader();
class Exercise{
	constructor(name,score){
		this.name = name;
		this.score = score;
	}

	static async createInteractive(interuptor = null){
		const name = await reader.read("Exercise Name>");
		if(name === "") return null;
		if(typeof interuptor === "function"){
			const interupt = interuptor(name);
			if(typeof interupt !== "undefined" && interupt !== null) return interupt;
		}
		const priority = await reader.read("Exercise Priority[0-9]>");
		return new this(name,priority)
	}

	static deserialize(record){
		return new this(record.name,record.score);
	}

	static async interactiveLoop(storage){
		while(true){
			let exercise = await Exercise.createInteractive(storage.interuptor());
			if([null,false].indexOf(exercise) > -1) continue;
			if(typeof exercise === "object"){
				if(typeof exercise.then === "undefined") storage.addExercise(exercise);
				else await exercise;
			}
		}
	}
}

module.exports = Exercise;