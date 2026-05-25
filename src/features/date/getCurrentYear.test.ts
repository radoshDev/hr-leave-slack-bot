// makeYear.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const testNowYear = 2025;
const testNowMonth = 9; // September
const testNowDay = 18; // 18th
const testNowTimestamp = `${testNowYear}-0${testNowMonth}-${testNowDay}T00:00:00.000Z`; // Sep 18, 2025, 12:00 PM UTC
const fixedNowDate = new Date(testNowTimestamp);

vi.doMock('date-fns', () => ({
	startOfDay: vi.fn(() => fixedNowDate),
}));

vi.doMock('@date-fns/tz', () => ({
	TZDate: vi.fn(function (this: { getFullYear: () => number }) {
		this.getFullYear = vi.fn(() => testNowYear);
	}),
}));

const importSut = async ({
	timezone,
	isInvalidDate,
	dateStamp,
}: {
	timezone?: string;
	isInvalidDate?: boolean;
	dateStamp: string;
}) => {
	vi.doMock('../../config/env.ts', () => ({
		config: { timezone },
	}));

	vi.doMock('./makeDate', () => ({
		makeDate: vi.fn(() => {
			if (isInvalidDate) return null;
			const date = new Date(dateStamp);
			return date;
		}),
	}));

	const mod = (await import(
		'./getCurrentYear'
	)) as typeof import('./getCurrentYear');
	return mod;
};

beforeEach(() => {
	vi.useFakeTimers();
	vi.setSystemTime(fixedNowDate);
});

afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
	vi.resetModules();
});

describe('makeYear', () => {
	it('returns currentYear when candidate date is after today', async () => {
		const testFutureDate = { day: testNowDay + 1, month: testNowMonth }; // Sep 19
		const testDateStamp = `${testNowYear}-0${testFutureDate.month}-${testFutureDate.day}T00:00:00.000Z`; // Sep 19, 2025
		const { getCurrentYear: makeYear } = await importSut({
			dateStamp: testDateStamp,
		});
		const { makeDate } = await import('./makeDate');

		const result = makeYear(testFutureDate);

		expect(result).toBe(testNowYear);

		expect(makeDate).toHaveBeenCalledWith({
			day: testFutureDate.day,
			month: testFutureDate.month,
			year: testNowYear,
		});
	});

	it('returns currentYear when candidate date is exactly today (>= startOfDay)', async () => {
		const { getCurrentYear: makeYear } = await importSut({
			dateStamp: '2025-09-18T00:00:00.000Z',
		});
		const result = makeYear({ day: 18, month: 9 }); // Sep 18 vs Sep 18 → same day
		expect(result).toBe(2025);
	});

	it('returns next year when candidate date already passed this year', async () => {
		const testPastDate = { day: testNowDay - 1, month: testNowMonth }; // Sep 17
		const testDateStamp = `${testNowYear}-0${testPastDate.month}-${testPastDate.day}T00:00:00.000Z`;
		const { getCurrentYear: makeYear } = await importSut({
			dateStamp: testDateStamp,
		});
		const result = makeYear(testPastDate); // Sep 17 vs Sep 18 → past
		expect(result).toBe(testNowYear + 1);
	});

	it('returns null when makeDate returns null (invalid day/month)', async () => {
		const { getCurrentYear: makeYear } = await importSut({
			dateStamp: testNowTimestamp,
			isInvalidDate: true,
		});
		// makeDateMock.mockReturnValueOnce(null); // force invalid candidate
		const result = makeYear({ day: 31, month: 2 }); // e.g., Feb 31 invalid
		expect(result).toBeNull();
	});
});
