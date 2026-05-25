import {
	addDays,
	differenceInCalendarDays,
	isBefore,
	startOfToday,
} from 'date-fns';
import { errorMessages } from '../constants/errorMessages';
import { formatDate } from '../utils/formatDate';
import { makeDate } from './date/makeDate';
import { parseDate } from './date/parseDate';
import type { LeaveRequestInput } from '../types/leaveRequest';

const DASH = /[-–—]/;

type ParseRange = (input: string) => Omit<LeaveRequestInput, 'userId' | 'type'>;

export const parseRange: ParseRange = (input) => {
	const inputDates = input.split(DASH);

	if (inputDates.length > 2 || !inputDates[0] || !inputDates[1]) {
		throw new Error(errorMessages.invalidDate);
	}

	const startDateObj = parseDate(inputDates[0]);
	const endDateObj = parseDate(inputDates[1]);

	if (!startDateObj || !endDateObj) throw new Error(errorMessages.invalidDate);

	const startDate = makeDate(startDateObj);
	const endDate = makeDate(endDateObj);

	if (!startDate || !endDate) throw new Error(errorMessages.invalidDate);

	const today = startOfToday();

	if (isBefore(endDate, today)) throw new Error(errorMessages.pastDate);

	if (startDate.getTime() > endDate.getTime())
		throw new Error(errorMessages.invalidRange);

	const isFriday = endDate.getDay() === 5;
	const isMoreThanOneDay = startDate.getTime() !== endDate.getTime();
	const adjustedEndDate =
		isFriday && isMoreThanOneDay ? addDays(endDate, 2) : endDate;

	const days = differenceInCalendarDays(adjustedEndDate, startDate) + 1;

	return {
		startDate: `${formatDate(startDate, 'yyyy-MM-dd')}T00:00:00Z`,
		endDate: `${formatDate(adjustedEndDate, 'yyyy-MM-dd')}T00:00:00Z`,
		days,
		year: startDate.getFullYear(),
	};
};
