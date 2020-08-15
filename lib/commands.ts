import { AddExercise, DeleteExercise, ShowExercises } from "./exercise";
import { AddGroup, ShowGroups } from "./group";
import { CommandFunction } from "./misc";
import { GenerateHelp } from './help';

export type CommandResponse = string | boolean;

export interface CommandHandler {
	hint: string;
	exec: CommandFunction;
};

const Titles: Record<string, [string, string]> = {
	'add': ['add -n [name]', 'Add an exercise'],
	'delete': ['delete [identifier]','Delete an exercise by identifier [identifier] (index, id, or name)'],
	'help': ['help [unit-command]?', 'Get Help on all commands, or on specific command'],
	'add-group': ['add-group -n [name] -e [...exercises] -w [weekday]', 'Add a new exercise group'],
	'show-groups': ['show-groups', 'Show existing exercise groups'],
	'show-exercises': ['show-exercises', 'Show current exercise list']
};

const longestFirstTitle = Object.values(Titles).reduce((carry, record) => Math.max(carry, record[0].length), 0);

export function constructCommandHandler(title: string, exec: CommandFunction): CommandHandler {
	const hint = `  ${Titles[title][0]}${' '.repeat(longestFirstTitle - Titles[title][0].length)}\t\t${Titles[title][1]} `;
	return { hint, exec };
}

export const BaseHandlers: CommandHandler[] = [

	constructCommandHandler('add', AddExercise),

	constructCommandHandler('delete', DeleteExercise),

	constructCommandHandler('show-exercises', ShowExercises),

	constructCommandHandler('add-group', AddGroup),

	constructCommandHandler('show-groups', ShowGroups),
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
