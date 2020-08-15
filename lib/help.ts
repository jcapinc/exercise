import { CommandFunction } from "./misc";
import { stat, readFile, Stats } from "fs";
import { join } from "path";

const Titles: Record<string, [string, string]> = {
	'add': ['add -n [name]', 'Add an exercise'],
	'delete': ['delete [identifier]','Delete an exercise by identifier [identifier] (index, id, or name)'],
	'help': ['help [unit-command]?', 'Get Help on all commands, or on specific command'],
	'add-group': ['add-group -n [name] -e [...exercises] -w [weekday]', 'Add a new exercise group'],
	'show-groups': ['show-groups', 'Show existing exercise groups'],
	'show-exercises': ['show-exercises', 'Show current exercise list']
};

export const longestFirstTitle = Object.values(Titles).reduce((carry, record) => Math.max(carry, record[0].length), 0);

export function getTitles() {
	return Titles;
}

function helpGenerater(name: string) {
	const path = join(__dirname, 'help', name + '.txt');
	return async (): Promise<string> => {
		const finfo: Stats = await new Promise((res, rej) => {
			stat(path, (err, statResult) => {
				if (err) rej(err);
				res(statResult);
			})
		});
		if (!finfo.isFile()) {
			throw new Error("Could not load helpfile for " + name);
		}
		return await new Promise((res, rej) => {
			readFile(path, async (err, data) => {
				if (err) rej(err);
				res(data.toString());
			});
		});
	}
}
export function GenerateHelp(handlers): CommandFunction {
	return async (args) => {
		const unit = args[2].toLocaleLowerCase();
		if (['help','-h','--help'].indexOf(unit) === -1) {
			return false;
		}
		if (args.length === 3) {
			console.log('Usage: node [unit-command] [...unit-options]\n');
			console.log('\x1b[4m%s\x1b[0m\n','UNIT COMMANDS:');
			handlers.map(handler => console.log(handler.hint));
			console.log('');
			return true;
		}
		console.log(await helpGenerater(args[3])());
		return true;
	}
	
}