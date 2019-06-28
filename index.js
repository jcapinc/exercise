const Exercise = require("./models/Exercise");
const Storage = require("./models/Storage");
const fs = require("fs");

async function main(){
	const storage = new Storage();
	try{ 
		await storage.deserializeFile("db.json");
	} catch(e) {
		console.log(e);
	}
	Exercise.interactiveLoop(storage);
}




main();