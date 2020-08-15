
export function Dictionarize<T extends Object>(records: T[], field: keyof T) {
	return records.reduce((carry, record) => {
		carry[`${record[field]}`] = record;
		return carry;
	}, {} as Record<string | number, T>);
}

export type DayAbrv = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export const days: DayAbrv[] = [
	'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

export interface IDRecord {
	id: string;
}


export function AcceptMultiwordInput(args: string[], pointer: number, joiner: string = ' '): [string, number] {
	const words: string[] = [];
	while (args[pointer] !== undefined && args[pointer][0] !== '-') {
		words.push(args[pointer++]);
	}
	return [words.join(joiner), pointer - 1];
}

export type CommandFunction = (args: string[]) => Promise<CommandResponse>;


export type CommandResponse = string | boolean;

export interface CommandHandler {
	hint: string;
	exec: CommandFunction;
};
