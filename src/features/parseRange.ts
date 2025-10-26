import { differenceInCalendarDays, isPast } from 'date-fns';
import { errorMessages } from '../constants/errorMessages';
import { makeDate } from './date/makeDate';
import { parseDate } from './date/parseDate';
import type { ParsedVacation } from '../types/vacation';

const DASH = /[-–—]/;

export const parseRange = (input: string): ParsedVacation => {
	const inputDates = input.split(DASH);

	if (inputDates.length > 2 || !inputDates[0] || !inputDates[1]) {
		throw new Error(errorMessages.invalidDate);
	}

	const startDate = parseDate(inputDates[0]);
	const endDate = parseDate(inputDates[1]);

	if (!startDate || !endDate) throw new Error(errorMessages.invalidDate);

	const start = makeDate(startDate);
	const end = makeDate(endDate);

	if (!start || !end) throw new Error(errorMessages.invalidDate);
	if (isPast(start) || isPast(end)) throw new Error(errorMessages.pastDate);

	if (start.getTime() > end.getTime())
		throw new Error(errorMessages.invalidRange);

	const days = differenceInCalendarDays(end, start) + 1;

	if (days > 21) throw new Error(errorMessages.exceedsMaxDays);

	return { start, end, days };
};
