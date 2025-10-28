import { TZDate } from '@date-fns/tz';
import { config } from '../../config/env';
import type { DateObject } from '../../types/date';

export const makeDate = ({ year, month, day }: DateObject): Date | null => {
	const tzDate = new TZDate(year, month - 1, day, config.timezone);

	if (
		tzDate.getFullYear() !== year ||
		tzDate.getMonth() + 1 !== month ||
		tzDate.getDate() !== day
	) {
		return null;
	}
	return tzDate;
};
