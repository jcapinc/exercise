const LineReader = require("./LineReader");
const reader = new LineReader();
class Exercise{
	constructor(name,score){
		this.name = name;
		this.score = score;
	}

	static async createInteractive(interuptor = null){
		const name = await reader.read("Exercise Name>");
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
}

module.exports = Exercise;