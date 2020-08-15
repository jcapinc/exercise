import { AddExercise, DeleteExercise, ShowExercises } from "./exercise";
import { AddGroup, ShowGroups } from "./group";
import { CommandFunction } from "./misc";
import { GenerateHelp, getTitles, longestFirstTitle } from './help';

export interface CommandHandler {
	hint: string;
	exec: CommandFunction;
};

export function constructCommandHandler(title: string, exec: CommandFunction): CommandHandler {
	const Titles = getTitles();
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
