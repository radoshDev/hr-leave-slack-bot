import { getCurrentYear } from './getCurrentYear';
import type { DateObject } from '../../types/date';

const DATE_RE = /^\s*(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?\s*$/;

export function parseDate(input: string): DateObject | null {
	const match = input.match(DATE_RE);

	if (!match) return null;

	const day = Number(match[1]);

	if (day < 1 || day > 31) return null;

	const month = Number(match[2]);

	if (month < 1 || month > 12) return null;

	const year = match[3] ? Number(match[3]) : getCurrentYear();

	if (!year) return null;

	return { day, month, year };
}
