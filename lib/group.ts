import uniqid from 'uniqid';
import { IDRecord, DayAbrv, days, AcceptMultiwordInput } from './misc';
import { LoadState, SaveState } from './state';
import { SelectExercise } from './exercise';

export interface Group extends IDRecord {
	name: string;
	weekday: DayAbrv;
	exercises: string[];
}

export function makeBlankGroup(): Group {
	return {
		id: uniqid(),
		exercises: [],
		name: "",
		weekday: "Sun"
	};
}

export function isGroup(group: unknown): group is Group {
	if (typeof group !== 'object') {
		return false;
	}
	const blankGroup = makeBlankGroup()
	for(const key in blankGroup) {
		if (!(key in group)) {
			return false;
		}
		if (typeof blankGroup[key] !== typeof group[key]) {
			return false;
		}
	}
	return true;
}

export async function AddGroup(args: string[]){
	if (args[2].toLocaleLowerCase() !== 'add-group') {
		return false;
	}
	const newRecord: Partial<Group> = {
		id: uniqid()
	};
	let argPointer = 3;
	const dayDict: Record<string, DayAbrv> = days.reduce((carry, record) => {
		carry[record.toLocaleLowerCase()] = record;
		return carry;
	}, {});
	const state = await LoadState();
	while (argPointer < args.length) {
		switch (args[argPointer]) {
			case '-n': case '--name': newRecord.name = args[++argPointer]; break;
			case '-w': case '--weekday': 
				const input = args[++argPointer].toLocaleLowerCase();
				if (typeof dayDict[input] === undefined) {
					return `'${input}' is not a valid day of the week (try ${days.join(', ')})`;
				}
				newRecord.weekday = dayDict[input];
				break;
			case '-e': case '--exercises':
				const result = AcceptMultiwordInput(args, argPointer + 1, ',');
				argPointer = result[1];
				newRecord.exercises = result[0].split(',').reduce((carry, identifier) => {
					const result = SelectExercise(identifier, state.exercises);
					if (result === false) {
						console.log('\'%s\' is not a valid exercise identifier', identifier);
						return carry;
					}
					carry.push(result.id);
					return carry;
				}, []);
				break;
			default: console.log("Invalid Arguement: %s", args[argPointer]);break;
		}
		argPointer++;
	}
	if (!isGroup(newRecord)) {
		console.log({newRecord});
		return "Name, Weekday and Exercise List are required to make a new group";
	}
	state.groups.push(newRecord);
	const saved = await SaveState(state);
	if (saved === false) {
		return "There was a problem saving the state";
	}
	console.log("Group Added");
	return true;
}

export async function ShowGroups(args: string[]){
	return "Not Implemented";
}