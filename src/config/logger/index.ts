import { emitLog } from './emitLog';

export const logger = Object.freeze({
	debug: (...a: unknown[]) => emitLog('debug', ...a),
	info: (...a: unknown[]) => emitLog('info', ...a),
	warn: (...a: unknown[]) => emitLog('warn', ...a),
	error: (...a: unknown[]) => emitLog('error', ...a),
});
