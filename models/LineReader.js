const readline = require("readline");

class LineReader {
	constructor(){
		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
	}

	read(question){
		return new Promise(resolve => this.rl.question(question,resolve));
	}
}

module.exports = LineReader;