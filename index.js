const Exercise = require("./models/Exercise");
const Storage = require("./models/Storage");
const fs = require("fs");
async function main(){
	let cont = true;
	const storage = new Storage();
	try{ 
		await storage.deserializeFile("db.json");
	} catch(e) {
		console.log(e);
	}

	while(cont){
		let exercise = await Exercise.createInteractive(name => {
			if(name == "list"){
				listExercises(storage.exercises);
				return false;
			} 
			if(name == "save"){
				save(storage);
				return false;
			}
			if(name == "end"){
				cont = false;
				return cont;
			}
		});
		if(typeof exercise === "object"){
			if(typeof exercise.then === "undefined") storage.addExercise(exercise);
			else {
				exercise = await exercise;
				if(typeof exercise === "object") storage.addExercise(exercise);
			}
		}
	}
	process.exit(0);
}

function listExercises(exercises){
	return exercises.map((e,i) => console.log(`${i}: [${e.score}] ${e.name}`));
}

function save(storage){
	return new Promise(( resolve, reject) => fs.writeFile("db.json",storage.serialize(),err => {
		if(err) return reject();
		return resolve();
	}));
}

main();