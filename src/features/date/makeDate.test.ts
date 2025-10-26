import { tz } from '@date-fns/tz';
import { format } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const loadMakeDateWithTZ = async (timezone: string) => {
	vi.resetModules();
	vi.doMock('../../config/env', () => ({ config: { timezone } }));
	return await import('./makeDate');
};

beforeEach(() => {
	vi.useFakeTimers();
	vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
});

afterEach(() => {
	vi.useRealTimers();
	vi.clearAllMocks();
});

describe('makeDate', () => {
	it('returns start of day in Europe/Kyiv for a valid date', async () => {
		const { makeDate } = await loadMakeDateWithTZ('Europe/Kyiv');
		const d = makeDate({ year: 2025, month: 10, day: 10 });
		expect(d).not.toBeNull();
		const s = format(d!, 'yyyy-MM-dd HH:mm:ssXXX', { in: tz('Europe/Kyiv') });
		expect(s).toBe('2025-10-10 00:00:00+03:00');
	});

	it('returns null for an invalid calendar date', async () => {
		const { makeDate } = await loadMakeDateWithTZ('Europe/Kyiv');
		const d = makeDate({ year: 2025, month: 2, day: 30 });
		expect(d).toBeNull();
	});

	it('honors timezone: America/New_York midnight', async () => {
		const { makeDate } = await loadMakeDateWithTZ('America/New_York');
		const d = makeDate({ year: 2025, month: 7, day: 1 });
		expect(d).not.toBeNull();
		const s = format(d!, 'yyyy-MM-dd HH:mm:ssXXX', {
			in: tz('America/New_York'),
		});
		expect(s).toBe('2025-07-01 00:00:00-04:00');
	});

	it('handles DST boundary correctly (Europe/Kyiv)', async () => {
		const { makeDate } = await loadMakeDateWithTZ('Europe/Kyiv');
		const d = makeDate({ year: 2025, month: 3, day: 30 });
		expect(d).not.toBeNull();
		const s = format(d!, 'yyyy-MM-dd HH:mm:ssXXX', { in: tz('Europe/Kyiv') });
		expect(s).toMatch(/^2025-03-30 00:00:00\+0[23]:00$/);
	});

	it('rounds to start of day regardless of system time', async () => {
		const { makeDate } = await loadMakeDateWithTZ('Europe/Kyiv');
		const d = makeDate({ year: 2025, month: 1, day: 1 });
		const s = format(d!, 'HH:mm:ss', { in: tz('Europe/Kyiv') });
		expect(s).toBe('00:00:00');
	});
});
