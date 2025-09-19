import { startOfDay } from 'date-fns';
import { TZDate } from '@date-fns/tz';
import { makeDate } from './makeDate';
import { config } from '../../config/env';
import type { DateObject } from '../../types/date';

export function makeYear({
	day,
	month,
}: Omit<DateObject, 'year'>): number | null {
	const now = new TZDate(new Date(), config.timezone);
	const currentYear = now.getFullYear();
	const todayStart = startOfDay(now);

	const candidate = makeDate({ day, month, year: currentYear });

	if (!candidate) return null;

	return candidate.getTime() >= todayStart.getTime()
		? currentYear
		: currentYear + 1;
}
