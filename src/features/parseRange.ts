import { differenceInCalendarDays } from 'date-fns';
import { parseDate } from './date/parseDate';
import { makeDate } from './date/makeDate';

export type ParsedVacation = {
	start: Date;
	end: Date;
	days: number;
	input: string;
};

const DASH = /[-–—]/;

export const parseRange = (input: string): ParsedVacation => {
	const inputDates = input.split(DASH);

	if (inputDates.length > 2 || !inputDates[0] || !inputDates[1]) {
		throw new Error('Invalid format');
	}

	const startDate = parseDate(inputDates[0]);
	const endDate = parseDate(inputDates[1]);

	if (!startDate || !endDate) throw new Error('Invalid format');

	const start = makeDate(startDate);
	const end = makeDate(endDate);

	if (!start || !end) throw new Error('Invalid date');

	if (start.getTime() > end.getTime()) throw new Error('End date before start');

	const days = differenceInCalendarDays(end, start) + 1;

	if (days > 21) throw new Error('Range exceeds 21 days');

	return { start, end, days, input };
};
