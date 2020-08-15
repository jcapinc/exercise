import { IDRecord } from "./misc";

export interface ExerciseLog extends IDRecord {
	exerciseId: string;
	repetitions?: number;
	duration?: number;
	group: string;
}