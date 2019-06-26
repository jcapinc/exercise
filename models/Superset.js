const Exercise = require("./Exercise");

class Superset{
	constructor(exercises,score){
		this.exercises = exercises;
		this.score = score;
	}

	addExercise(exercise){
		this.exercises.push(exercise);
	}

	deserialize(record){
		if(!Array.isArray(record.exercises)) record.exercises = [];
		return new Superset(record.exercises.map(Exercise.deserialize),record.score);
	}
}

module.exports = Superset;