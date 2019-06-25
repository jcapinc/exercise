const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const cmds = {
	"permutate": permutate(process.argv[2]),
}

class Exercise{
	constructor(name,priority){
		this.name = name;
		this.priority = priority;
	}
}

async function permutate(filename){
	let exercises = await new Promise(resolve => {

	});
}