import { tz } from '@date-fns/tz';
import { format } from 'date-fns';
import { config } from '../config/env';

export const formatDate = (d: Date) =>
	format(d, 'dd.MM.yyyy', { in: tz(config.timezone) });
