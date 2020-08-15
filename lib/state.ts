import { resolve } from 'path';
import { Exercise } from './exercise';
import { ExerciseLog } from './log';
import { Group } from './group';
import { readFile, writeFile } from 'fs';

export interface State {
	exercises: Exercise[];
	logs: ExerciseLog[];
	groups: Group[];
}

const dbfile = resolve("db.json");

export async function LoadState(): Promise<State> {
	const content: string = await new Promise(res => readFile(dbfile, 'utf8', (err, buff) => {
		if (err) return res(JSON.stringify(makeBlankState()));
		res(buff.toString())
	}));
	const data: unknown = JSON.parse(content);
	if (!isState(data)) {
		throw new Error("The database is malformed");
	}
	return data;
}

export function isState(state: unknown): state is State {
	if (typeof state !== 'object') {
		return false;
	}
	for (const key of Object.keys(makeBlankState())) {
		if (!(key in state)) {
			return false;
		}
	}
	return true;
}

export function SaveState(state: State): Promise<boolean> {
	return new Promise(res => {
		writeFile(dbfile, JSON.stringify(state, null, 2), 'utf8', (err) => {
			if (err) res(false);
			else res(true);
		})
	});
}

export function makeBlankState(): State {
	return {
		exercises: [],
		logs: [],
		groups: []
	};
}