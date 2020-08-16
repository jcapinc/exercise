import { AddExercise, DeleteExercise, ShowExercises, Status } from "./exercise";
import { AddGroup, ShowGroups, DeleteGroup } from "./group";
import { CommandFunction } from "./misc";
import { GenerateHelp } from './help';
import { AddExerciseLog, DeleteExerciseLog, ShowExerciseLog } from "./log";

export interface CommandHandler {
	hint: string;
	exec: CommandFunction;
};

const Titles: Record<string, [string, string]> = {
	'add': ['add -n [name]', 'Add an exercise'],
	'delete': ['delete [identifier]','Delete an exercise by identifier [identifier] (index, id, or name)'],
	'help': ['help [unit-command]?', 'Get Help on all commands, or on specific command'],
	'add-group': ['add-group -n [name] -e [...exercises] -w [weekday]', 'Add a new exercise group'],
	'delete-group': ['delete-group [identifier]', 'Delete exercise group'],
	'show-groups': ['show-groups', 'Show existing exercise groups'],
	'show-exercises': ['show-exercises', 'Show current exercise list'], 	
	'add-log': ['add-log -e [exercise] -w [weight] -s [set] [set] [set]', 'Add an exercise log entry'],
	'delete-log':['delete-log', '*backfill documentation*'],
	'show-log': ['show-log', '*backfill documentation*'],
	'status': ['status', 'Show status of current sessions']
};

export const longestFirstTitle = Object.values(Titles).reduce((carry, record) => Math.max(carry, record[0].length), 0);

export function constructCommandHandler(title: string, exec: CommandFunction): CommandHandler {
	const hint = `  ${Titles[title][0]}${' '.repeat(longestFirstTitle - Titles[title][0].length)}\t\t${Titles[title][1]} `;
	return { hint, exec };
}

export const BaseHandlers: CommandHandler[] = [
	constructCommandHandler('add', AddExercise),
	constructCommandHandler('delete', DeleteExercise),
	constructCommandHandler('show-exercises', ShowExercises),
	constructCommandHandler('status', Status),
	constructCommandHandler('add-group', AddGroup),
	constructCommandHandler('delete-group', DeleteGroup),
	constructCommandHandler('show-groups', ShowGroups),
	constructCommandHandler('add-log', AddExerciseLog),
	constructCommandHandler('delete-log', DeleteExerciseLog),
	constructCommandHandler('show-log', ShowExerciseLog),
];
BaseHandlers.push(constructCommandHandler('help', GenerateHelp(BaseHandlers)));

export async function HandleCommand(args: string[]) {
	for (const handler of BaseHandlers) {
		const response = await handler.exec(args);
		if (typeof response === 'string') {
			console.log(response);
			return false;
		}
		if (response === true) {
			return true;
		}
	}
	return false;
}
