import { TZDate } from '@date-fns/tz';
import { config } from '../../config/env';

export function getCurrentYear(): number {
	const now = new TZDate(new Date(), config.timezone);
	const currentYear = now.getFullYear();

	return currentYear;
}
