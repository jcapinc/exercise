const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
class LineReader {
	constructor(){
		this.rl = rl;
	}

	read(question){
		return new Promise(resolve => this.rl.question(question,resolve));
	}
}

module.exports = LineReader;