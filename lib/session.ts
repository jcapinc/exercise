import { State } from './state';
import { getGroupByExercise, Group } from './group';
import { Exercise } from './exercise';
import { DayAbrv, IDRecord } from './misc';
import uniqid from 'uniqid';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { execArgv } from 'process';

dayjs.extend(minMax);

export interface Session extends IDRecord {
	group: string;
	date: string;
}

const WeekdayMap: Record<DayAbrv, number> = {
	'Sun': 0,
	'Mon': 1,
	'Tue': 2,
	'Wed': 3,
	'Thu': 4,
	'Fri': 5,
	'Sat': 6
};

export function getExerciseSession(exercise: Exercise, state: State): [Session, State] {
	const group = getGroupByExercise(exercise, state.groups);
	if (group === false) {
		throw new Error("Cannot get exercise session for an exercise that is not in any group");
	}

	if (state.sessions.length === 0) {
		const session = instantiateGroupSession(group);
		state.sessions.push(session);
		return [session, state];
	}

	const filteredSession = state.sessions.filter(session => session.group === group.id);
	if (filteredSession.length === 0) {
		const session = instantiateGroupSession(group);
		state.sessions.push(session);
		return [session, state]
	}

	const sessionExerciseMap: Record<string, boolean> = state.logs.filter(record => 
		record.exerciseId === exercise.id
	).reduce((carry, record) => {
		carry[record.session] = true;
		return carry;
	}, {});

	const selectedSession = filteredSession.find(session => sessionExerciseMap[session.id] === undefined);
	if (selectedSession === undefined) {
		const session = generateNextSession(group, filteredSession);
		state.sessions.push(session);
		return [session, state];
	}
	return [selectedSession, state];
}

function generateNextSession(group: Group, extent: Session[]): Session {
	if (extent.length === 0) {
		throw new Error("Cannot generate next session when there are no extent sessions");
	}
	const maxDate = dayjs.max(...extent.map(record => dayjs(record.date)));
	const newSession = createSession(group);
	return {...newSession, date: maxDate.add(7,'d').toDate().toString()};
}

function instantiateGroupSession(group: Group) {
	const newSession = createSession(group);
	newSession.date = getMostRecentDayOfWeek(group.weekday).toString();
	return newSession;
}

export function createSession(group: Group): Session {
	return { 
		id: uniqid(),
		group: group.id, 
		date: (new Date()).toString() 
	};
}

function getMostRecentDayOfWeek(abbr: DayAbrv) {
	let dt = new Date();
	while (dt.getDay() !== WeekdayMap[abbr]) {
		dt = dayjs(dt).subtract(1,'day').toDate()
	}
	dt.setSeconds(0);
	dt.setMinutes(0);
	dt.setHours(0);
	return dt;
}

export function isSessionComplete(session: Session, state: State): boolean {
	const group = state.groups.find(group => session.group === group.id);
	for (const eid of group.exercises) {
		if (state.logs.find(log => log.session === session.id && log.exerciseId === eid) === undefined) {
			return false;
		}
	}
	return true;
}