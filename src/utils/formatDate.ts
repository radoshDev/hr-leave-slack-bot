import { tz } from '@date-fns/tz';
import { format } from 'date-fns';
import { config } from '../config/env';

type FormaStr = 'dd.MM.yyyy' | 'yyyy-MM-dd';

export const formatDate = (d: Date, formatStr: FormaStr): string =>
	format(d, formatStr, { in: tz(config.timezone) });
