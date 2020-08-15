import { HandleCommand } from './lib/commands';

(async function(){
	if (require.main === module) {
		try {
			if (await HandleCommand(process.argv) === false) {
				console.log("Command Failed.");
			}
		} catch(error) {
			console.log(error.message);
		}
	}
})();