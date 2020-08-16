import uniqid from 'uniqid';
import { IDRecord, AcceptMultiwordInput } from "./misc";
import { LoadState, SaveState } from './state';
import { SelectExercise, Exercise, isExercise } from './exercise';
import { getExerciseSession } from './session';

export interface ExerciseLog extends IDRecord {
	exerciseId: string;
	sets?: number[];
	weight?: number
	session: string;
	date: string;
}

function makeBlankExerciseLog(): ExerciseLog {
	return {
		id: uniqid(),
		exerciseId: "",
		session: "",
		date: (new Date()).toString()
	}
}

function isExerciseLog(log: unknown): log is ExerciseLog {
	if (typeof log !== 'object') {
		return false;
	}
	const blank = makeBlankExerciseLog();
	for (const key in blank) {
		if (typeof log[key] === undefined) {
			return false;
		}
	}
	return true;
}

export async function AddExerciseLog(args:string[]) {
	if (args[2].toLocaleLowerCase() !== 'add-log') {
		return false;
	}
	const newRecord: Partial<ExerciseLog> = { id: uniqid() };
	let argPointer = 0;
	let state = await LoadState();
	let exercise: Exercise | false;

	while (argPointer < args.length) {
		switch(args[argPointer]) {
			case '-s': case '--sets': 
				let setList: string;
				[setList, argPointer] = AcceptMultiwordInput(args, argPointer + 1, ',');
				newRecord.sets = setList.split(',').map(record => parseInt(record));
				break;
			case '-e': case '--exercise':
				let identifier: string;
				[identifier, argPointer] = AcceptMultiwordInput(args, argPointer + 1);
				exercise = SelectExercise(identifier, state.exercises);
				if (exercise === false) {
					return `'${identifier}' does not match any exercise`;
				}
				newRecord.exerciseId = exercise.id;
				break;
			case '-w': case '--weight': newRecord.weight = parseInt(args[++argPointer] || "0"); break;
		}
		argPointer++;
	}

	if (!isExercise(exercise)) {
		return "Exercise identifier is a required field";
	}
	
	const result = getExerciseSession(exercise, state);
	state = result[1];
	newRecord.session = result[0].id;
	if (!isExerciseLog(newRecord)) {
		return "Exercise log record is incomplete for an unanticipated reason";
	}
	state.logs.push(newRecord);
	if (await SaveState(state)) return true;
	return "There was a problem saving the state";
}

export async function DeleteExerciseLog(args: string[]) {
	if (args[2].toLocaleLowerCase() !== 'delete-log') {
		return false;
	}
	return "Not Implemented";
}

export async function ShowExerciseLog(args: string[]) {
	if (args[2].toLocaleLowerCase() !== 'show-log') {
		return false;
	}
	return "Not Implemented";
}