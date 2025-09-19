/** biome-ignore-all lint/suspicious/noConsole: for logger it's necessary */
import { tz } from '@date-fns/tz';
import { format } from 'date-fns';
import { config } from '../env';

type Level = keyof Pick<Console, 'debug' | 'info' | 'warn' | 'error'>;

const rank: Record<Level, number> = {
	debug: 10,
	info: 20,
	warn: 30,
	error: 40,
};

export const emitLog = (lvl: Level, ...args: unknown[]) => {
	if (rank[lvl] < rank[config.logLevel]) return;

	const logTimeFormat = format(new Date(), 'yyyy-MM-dd HH:mm:ssXXX', {
		in: tz(config.timezone),
	});
	const prefix = `[${logTimeFormat}] [${lvl.toUpperCase()}]`;
	console[lvl](prefix, ...args);
};
