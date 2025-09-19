import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';

const setup = async () => {
	const makeYearMock = vi.fn();
	vi.doMock('./makeYear', () => ({ makeYear: makeYearMock }));
	const mod = await import('./parseDate');
	const { makeYear } = await import('./makeYear');
	return {
		parseDate: mod.parseDate,
		makeYearMock: makeYear as unknown as Mock,
	};
};

afterEach(() => {
	vi.clearAllMocks();
	vi.resetModules();
});

describe('parseDate', () => {
	it('parses dd.MM and uses makeYear', async () => {
		const { parseDate, makeYearMock } = await setup();
		makeYearMock.mockReturnValue(2026);
		const res = parseDate('10.10');
		expect(res).toEqual({ day: 10, month: 10, year: 2026 });
		expect(makeYearMock).toHaveBeenCalledWith({ day: 10, month: 10 });
	});

	it('parses dd.MM.yyyy and does not call makeYear', async () => {
		const { parseDate, makeYearMock } = await setup();
		const res = parseDate('10.10.2025');
		expect(res).toEqual({ day: 10, month: 10, year: 2025 });
		expect(makeYearMock).not.toHaveBeenCalled();
	});

	it('trims whitespace', async () => {
		const { parseDate, makeYearMock } = await setup();
		makeYearMock.mockReturnValue(2030);
		const res = parseDate('   1.9   ');
		expect(res).toEqual({ day: 1, month: 9, year: 2030 });
		expect(makeYearMock).toHaveBeenCalledWith({ day: 1, month: 9 });
	});

	it('supports leading zeros', async () => {
		const { parseDate, makeYearMock } = await setup();
		makeYearMock.mockReturnValue(2031);
		const res = parseDate('01.09');
		expect(res).toEqual({ day: 1, month: 9, year: 2031 });
		expect(makeYearMock).toHaveBeenCalledWith({ day: 1, month: 9 });
	});

	it('returns null for invalid day', async () => {
		const { parseDate, makeYearMock } = await setup();
		expect(parseDate('0.10')).toBeNull();
		expect(parseDate('32.10')).toBeNull();
		expect(makeYearMock).not.toHaveBeenCalled();
	});

	it('returns null for invalid month', async () => {
		const { parseDate, makeYearMock } = await setup();
		expect(parseDate('10.0')).toBeNull();
		expect(parseDate('10.13')).toBeNull();
		expect(makeYearMock).not.toHaveBeenCalled();
	});

	it('returns null when makeYear returns null', async () => {
		const { parseDate, makeYearMock } = await setup();
		makeYearMock.mockReturnValue(null);
		expect(parseDate('30.02')).toBeNull();
	});

	it('returns null for bad formats', async () => {
		const { parseDate } = await setup();
		expect(parseDate('')).toBeNull();
		expect(parseDate('abc')).toBeNull();
		expect(parseDate('5/7')).toBeNull();
		expect(parseDate('5-7')).toBeNull();
		expect(parseDate('5.7.20')).toBeNull();
	});
});
