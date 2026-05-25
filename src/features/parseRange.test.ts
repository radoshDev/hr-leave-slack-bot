import { afterEach, describe, expect, it, type Mock, vi } from 'vitest';
import { errorMessages } from '../constants/errorMessages';
import { parseRange } from './parseRange';

vi.mock('../utils/formatDate', () => ({
	formatDate: vi.fn((d: Date, fmt: string) => {
		const pad = (n: number) => String(n).padStart(2, '0');
		if (fmt === 'yyyy-MM-dd')
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
		return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
	}),
}));

async function setup() {
	vi.mock('./date/parseDate', () => ({ parseDate: vi.fn() }));
	const { parseDate } = await import('./date/parseDate');
	vi.mock('./date/makeDate', () => ({ makeDate: vi.fn() }));
	const { makeDate } = await import('./date/makeDate');
	vi.mock('date-fns', () => ({
		differenceInCalendarDays: vi.fn(),
		isBefore: vi.fn().mockReturnValue(false),
		startOfToday: vi.fn().mockReturnValue(new Date('2024-01-01')),
		addDays: vi.fn((d: Date, n: number) => {
			const result = new Date(d);
			result.setDate(result.getDate() + n);
			return result;
		}),
	}));
	const { differenceInCalendarDays, isBefore, addDays } = await import(
		'date-fns'
	);
	return {
		mockParseDate: parseDate as unknown as Mock,
		mockMakeDate: makeDate as unknown as Mock,
		mockDifferenceInCalendarDays: differenceInCalendarDays as unknown as Mock,
		mockIsBefore: isBefore as unknown as Mock,
		mockAddDays: addDays as unknown as Mock,
	};
}

describe('parseRange', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.resetModules();
	});

	it('parses valid input and returns parsed leave range', async () => {
		const { mockParseDate, mockMakeDate, mockDifferenceInCalendarDays } =
			await setup();
		mockParseDate.mockImplementationOnce((s: string) => `parsed-${s.trim()}`);
		mockParseDate.mockImplementationOnce((s: string) => `parsed-${s.trim()}`);
		const fakeStart = new Date('2024-06-03'); // Monday
		const fakeEnd = new Date('2024-06-10'); // Monday
		mockMakeDate.mockImplementationOnce(() => fakeStart);
		mockMakeDate.mockImplementationOnce(() => fakeEnd);
		mockDifferenceInCalendarDays.mockReturnValue(9);

		const result = parseRange('03.06.2024-10.06.2024');

		expect(result).toEqual({
			startDate: '2024-06-03T00:00:00Z',
			endDate: '2024-06-10T00:00:00Z',
			days: 10,
			year: 2024,
		});
		expect(mockParseDate).toHaveBeenCalledTimes(2);
		expect(mockMakeDate).toHaveBeenCalledTimes(2);
		expect(mockDifferenceInCalendarDays).toHaveBeenCalledWith(
			fakeEnd,
			fakeStart,
		);
	});

	it('extends end date to Sunday when multi-day range ends on Friday', async () => {
		const {
			mockParseDate,
			mockMakeDate,
			mockDifferenceInCalendarDays,
			mockAddDays,
		} = await setup();
		mockParseDate.mockImplementation((s: string) => `parsed-${s.trim()}`);
		const fakeStart = new Date('2024-06-03'); // Monday
		const fakeEnd = new Date('2024-06-07'); // Friday
		const fakeSunday = new Date('2024-06-09'); // Sunday
		mockMakeDate.mockImplementationOnce(() => fakeStart);
		mockMakeDate.mockImplementationOnce(() => fakeEnd);
		mockAddDays.mockReturnValue(fakeSunday);
		mockDifferenceInCalendarDays.mockReturnValue(6);

		const result = parseRange('03.06.2024-07.06.2024');

		expect(mockAddDays).toHaveBeenCalledWith(fakeEnd, 2);
		expect(mockDifferenceInCalendarDays).toHaveBeenCalledWith(
			fakeSunday,
			fakeStart,
		);
		expect(result).toEqual({
			startDate: '2024-06-03T00:00:00Z',
			endDate: '2024-06-09T00:00:00Z',
			days: 7,
			year: 2024,
		});
	});

	it('does not extend end date when single-day range falls on Friday', async () => {
		const {
			mockParseDate,
			mockMakeDate,
			mockDifferenceInCalendarDays,
			mockAddDays,
		} = await setup();
		mockParseDate.mockImplementation((s: string) => `parsed-${s.trim()}`);
		const fakeStart = new Date('2024-06-07'); // Friday
		const fakeEnd = new Date('2024-06-07'); // Friday
		mockMakeDate.mockImplementationOnce(() => fakeStart);
		mockMakeDate.mockImplementationOnce(() => fakeEnd);
		mockDifferenceInCalendarDays.mockReturnValue(0);

		const result = parseRange('07.06.2024-07.06.2024');

		expect(mockAddDays).not.toHaveBeenCalled();
		expect(result).toEqual({
			startDate: '2024-06-07T00:00:00Z',
			endDate: '2024-06-07T00:00:00Z',
			days: 1,
			year: 2024,
		});
	});

	it('throws on input with more than two dates', () => {
		expect(() => parseRange('01.06.2024-10.06.2024-15.06.2024')).toThrow(
			errorMessages.invalidDate,
		);
	});

	it('throws on missing start date', () => {
		expect(() => parseRange('-10.06.2024')).toThrow(errorMessages.invalidDate);
	});

	it('throws on missing end date', () => {
		expect(() => parseRange('01.06.2024-')).toThrow(errorMessages.invalidDate);
	});

	it('throws if parseDate returns falsy for start', async () => {
		const { mockParseDate } = await setup();
		mockParseDate.mockImplementationOnce(() => null);
		mockParseDate.mockImplementationOnce(() => 'parsed-end');
		expect(() => parseRange('01.06.2024-10.06.2024')).toThrow(
			errorMessages.invalidDate,
		);
	});

	it('throws if parseDate returns falsy for end', async () => {
		const { mockParseDate } = await setup();
		mockParseDate.mockImplementationOnce(() => 'parsed-start');
		mockParseDate.mockImplementationOnce(() => undefined);
		expect(() => parseRange('01.06.2024-10.06.2024')).toThrow(
			errorMessages.invalidDate,
		);
	});

	it('throws if makeDate returns falsy for start', async () => {
		const { mockParseDate, mockMakeDate } = await setup();
		mockParseDate.mockImplementation(() => 'parsed');
		mockMakeDate.mockImplementationOnce(() => null);
		mockMakeDate.mockImplementationOnce(() => new Date());
		expect(() => parseRange('01.06.2024-10.06.2024')).toThrow(
			errorMessages.invalidDate,
		);
	});

	it('throws if makeDate returns falsy for end', async () => {
		const { mockParseDate, mockMakeDate } = await setup();
		mockParseDate.mockImplementation(() => 'parsed');
		mockMakeDate.mockImplementationOnce(() => new Date());
		mockMakeDate.mockImplementationOnce(() => undefined);
		expect(() => parseRange('01.06.2024-10.06.2024')).toThrow(
			errorMessages.invalidDate,
		);
	});

	it('throws if dates are in the past', async () => {
		const { mockParseDate, mockMakeDate, mockIsBefore } = await setup();
		mockParseDate.mockImplementation(() => 'parsed');
		mockMakeDate.mockImplementationOnce(() => new Date('2023-01-01'));
		mockMakeDate.mockImplementationOnce(() => new Date('2023-01-05'));
		mockIsBefore.mockReturnValue(true);
		expect(() => parseRange('01.01.2023-05.01.2023')).toThrow(
			errorMessages.pastDate,
		);
	});

	it('throws if end date is before start date', async () => {
		const { mockParseDate, mockMakeDate } = await setup();
		mockParseDate.mockImplementation(() => 'parsed');
		const fakeStart = new Date('2024-06-10');
		const fakeEnd = new Date('2024-06-01');
		mockMakeDate.mockImplementationOnce(() => fakeStart);
		mockMakeDate.mockImplementationOnce(() => fakeEnd);
		expect(() => parseRange('10.06.2024-01.06.2024')).toThrow(
			errorMessages.invalidRange,
		);
	});

	it('accepts any dash character as separator', async () => {
		const { mockParseDate, mockMakeDate, mockDifferenceInCalendarDays } =
			await setup();
		mockParseDate.mockImplementation(() => 'parsed');
		const fakeStart = new Date('2024-06-03'); // Monday
		const fakeEnd = new Date('2024-06-10'); // Monday
		mockDifferenceInCalendarDays.mockReturnValue(9);

		const inputs = [
			'03.06.2024-10.06.2024',
			'03.06.2024–10.06.2024',
			'03.06.2024—10.06.2024',
			'03.06   —    10.06',
		];

		for (const input of inputs) {
			mockMakeDate.mockImplementationOnce(() => fakeStart);
			mockMakeDate.mockImplementationOnce(() => fakeEnd);

			const result = parseRange(input);
			expect(result).toEqual({
				startDate: '2024-06-03T00:00:00Z',
				endDate: '2024-06-10T00:00:00Z',
				days: 10,
				year: 2024,
			});
		}
	});
});
