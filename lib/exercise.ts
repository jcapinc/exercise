import uniqid from 'uniqid';
import { IDRecord, Dictionarize, AcceptMultiwordInput } from "./misc";
import { LoadState, SaveState } from './state';

type ExerciseType = "REPETITION" | "DURATION";

export interface Exercise extends IDRecord {
	name: string;
	type: ExerciseType;
}

export function SelectExercise(selector: string, exercises: Exercise[]) : Exercise | false { 
	if (typeof exercises[parseInt(selector)] !== undefined) {
		return exercises[selector];
	}
	const byId = Dictionarize(exercises, 'id');
	if (typeof byId[selector] !== undefined) {
		return byId[selector];
	}
	const byName = Dictionarize(exercises, 'name');
	if (typeof byName[selector] !== undefined){
		return byName[selector];
	}
	return false;
}

export function makeBlankExercise(): Exercise{
	return {
		id: uniqid(),
		name: "",
		type: "DURATION"
	};
}

export function isExercise(exercise: unknown): exercise is Exercise {
	if (typeof exercise !== 'object') {
		return false;
	}
	const blank = makeBlankExercise();
	for(const key in blank) {
		if (typeof exercise[key] === undefined) {
			return false;
		}
	}
	return true;
}

export async function AddExercise(args) {
	if (args[2].toLocaleLowerCase() !== 'add') {
		return false;
	}

	let argPointer = 3;
	const options: Partial<Exercise> = {
		id: uniqid(),
		type: "REPETITION"
	};
	while (argPointer < args.length) {
		switch (args[argPointer]) {
			case '-n': case '--name': 
				[options.name, argPointer] = AcceptMultiwordInput(args, argPointer + 1);
				break;
			case '-t': case '--type':
				switch (args[++argPointer].toUpperCase()) {
					case "D": case "DURATION": options.type = "DURATION"; break;
					case "R": case "REPETITION": options.type = "REPETITION"; break;
					default: console.log(`${args[argPointer]} is not a valid exercise type`); break;
				}
		}
		argPointer++;
	}
	if (!isExercise(options)) {
		throw new Error("Name is required to add an exercise");
	}
	const state = await LoadState();
	state.exercises.push(options);
	const saved = await SaveState(state);
	if (saved) {
		return true;
	}
	return "There was a problem saving the state";
}

export async function DeleteExercise(args) {
	if (args[2].toLowerCase() !== 'delete') {
		return false;
	}
	if (typeof args[3] === undefined) {
		return "Delete command requires an exercise identifier (index number, id, or name)";
	}
	const state = await LoadState();
	const executionee = SelectExercise(args[3], state.exercises);
	if (executionee === false) {
		return "Could not find the specified exercise";
	}
	const index = state.exercises.indexOf(executionee);
	if (index === -1) {
		return "There was a problem identifiying the exercise";
	}
	state.exercises.splice(index, 1);
	state.exercises = [...state.exercises];
	const saved = await SaveState(state);
	if (saved === false) {
		return "There was a problem saving the state!";
	}
	return true;
}

export async function ShowExercises(args){
	if (args[2].toLocaleLowerCase() !== 'show-exercises') {
		return false;
	}
	const colLengths: Record<string, number> = {};
	const state = await LoadState();
	if (state.exercises.length === 0) {
		console.log("There are no exercises on record.");
		return true;
	}
	state.exercises.forEach(value => {
		Object.keys(value).forEach(key => {
			colLengths[key] = Math.max(colLengths[key] || 0, value[key].length);
		});
	});

	const columnNames: (keyof Exercise)[] = ['id', 'name', 'type'];
	const colsep = '\t';
	console.log(" ind" + colsep + columnNames.map(header => {
		return header + ' '.repeat(colLengths[header] - header.length);
	}).join(colsep));
	console.log(' ---' + colsep + columnNames.map(header => {
		return '-'.repeat(colLengths[header]);
	}).join(colsep));
	state.exercises.map((exercise, index) => {
		console.log(' '.repeat(3 - index.toString().length) + index.toString() + colsep + columnNames.map(name => {
			return exercise[name] + ' '.repeat(colLengths[name] - exercise[name].length);
		}).join(colsep));
	});
	
	return true;
}