/** biome-ignore-all lint/suspicious/noConsole: this is Logger tests */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Config } from '../env';
import type { emitLog } from './emitLog';

const testTimeStamp = '2023-10-01T12:00:00.000Z';

vi.doMock('@date-fns/tz', () => ({
	tz: vi.fn((zone: string) => zone),
}));

vi.doMock('date-fns', () => ({
	format: vi.fn(() => testTimeStamp),
}));

const importSut = async (
	cfg: Partial<Config>,
): Promise<{ emitLog: typeof emitLog }> => {
	vi.doMock('../env', () => ({ config: cfg }));

	return await import('./emitLog');
};

beforeEach(() => {
	vi.spyOn(console, 'debug').mockImplementation(() => {});
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.resetModules();
});

describe('emitLog', () => {
	it('logs at the configured threshold (info -> info/warn/error)', async () => {
		const { emitLog } = await importSut({
			logLevel: 'info',
		});

		emitLog('debug'); // below threshold -> filtered
		emitLog('info'); // at threshold    -> should log
		emitLog('warn'); // above           -> should log
		emitLog('error'); // above           -> should log

		expect(console.debug).not.toHaveBeenCalled();
		expect(console.info).toHaveBeenCalledTimes(1);
		expect(console.warn).toHaveBeenCalledTimes(1);
		expect(console.error).toHaveBeenCalledTimes(1);
		expect(console.info).toHaveBeenCalledWith(`[${testTimeStamp}] [INFO]`);
	});

	it('only logs error when level is error', async () => {
		const { emitLog } = await importSut({
			logLevel: 'error',
		});

		emitLog('debug');
		emitLog('info');
		emitLog('warn');
		emitLog('error');

		expect(console.debug).not.toHaveBeenCalled();
		expect(console.info).not.toHaveBeenCalled();
		expect(console.warn).not.toHaveBeenCalled();
		expect(console.error).toHaveBeenCalledTimes(1);
		expect(console.error).toHaveBeenCalledWith(`[${testTimeStamp}] [ERROR]`);
	});

	it('should all logger to be called on debug level', async () => {
		const { emitLog } = await importSut({
			logLevel: 'debug',
		});

		emitLog('debug');
		emitLog('info');
		emitLog('warn');
		emitLog('error');

		expect(console.debug).toHaveBeenCalledWith(`[${testTimeStamp}] [DEBUG]`);
		expect(console.info).toHaveBeenCalledWith(`[${testTimeStamp}] [INFO]`);
		expect(console.warn).toHaveBeenCalledWith(`[${testTimeStamp}] [WARN]`);
		expect(console.error).toHaveBeenCalledWith(`[${testTimeStamp}] [ERROR]`);
	});

	it('does not call date libs when filtered out', async () => {
		const { emitLog } = await importSut({
			logLevel: 'error',
		});
		const { format } = await import('date-fns');

		emitLog('warn');

		expect(format).not.toHaveBeenCalled();
		expect(console.warn).not.toHaveBeenCalled();
	});
	it('should log extra arguments', async () => {
		const { emitLog } = await importSut({
			logLevel: 'warn',
		});

		emitLog('warn', 'extra1', 'extra2');

		expect(console.warn).toHaveBeenCalledWith(
			`[${testTimeStamp}] [WARN]`,
			'extra1',
			'extra2',
		);
	});
	it('passes timezone to tz() and uses it in format options', async () => {
		const { emitLog } = await importSut({
			logLevel: 'info',
			timezone: 'Europe/Kyiv',
		});
		const { tz } = await import('@date-fns/tz');
		const { format } = await import('date-fns');

		emitLog('info', 'x');

		expect(tz).toHaveBeenCalledWith('Europe/Kyiv');
		expect(format).toHaveBeenCalledWith(
			expect.any(Date),
			'yyyy-MM-dd HH:mm:ssXXX',
			expect.objectContaining({ in: 'Europe/Kyiv' }),
		);
	});
});
