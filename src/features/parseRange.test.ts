import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import { parseRange } from './parseRange';

async function setup() {
	vi.mock('./date/parseDate', () => ({ parseDate: vi.fn() }));
	const { parseDate } = await import('./date/parseDate');
	vi.mock('./date/makeDate', () => ({ makeDate: vi.fn() }));
	const { makeDate } = await import('./date/makeDate');
	vi.mock('date-fns', () => ({ differenceInCalendarDays: vi.fn() }));
	const { differenceInCalendarDays } = await import('date-fns');
	return {
		mockParseDate: parseDate as unknown as Mock,
		mockMakeDate: makeDate as unknown as Mock,
		mockDifferenceInCalendarDays: differenceInCalendarDays as unknown as Mock,
	};
}

describe('parseRange', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.resetModules();
	});

	it('parses valid input and returns ParsedVacation', async () => {
		const { mockParseDate, mockMakeDate, mockDifferenceInCalendarDays } =
			await setup();
		mockParseDate.mockImplementationOnce((s: string) => `parsed-${s.trim()}`);
		mockParseDate.mockImplementationOnce((s: string) => `parsed-${s.trim()}`);
		const fakeStart = new Date('2024-06-01');
		const fakeEnd = new Date('2024-06-10');
		mockMakeDate.mockImplementationOnce(() => fakeStart);
		mockMakeDate.mockImplementationOnce(() => fakeEnd);
		mockDifferenceInCalendarDays.mockReturnValue(9);

		const input = '01.06.2024-10.06.2024';
		const result = parseRange(input);

		expect(result).toEqual({
			start: fakeStart,
			end: fakeEnd,
			days: 10,
			input,
		});
		expect(mockParseDate).toHaveBeenCalledTimes(2);
		expect(mockMakeDate).toHaveBeenCalledTimes(2);
		expect(mockDifferenceInCalendarDays).toHaveBeenCalledWith(
			fakeEnd,
			fakeStart,
		);
	});

	it('throws on input with more than two dates', () => {
		expect(() => parseRange('01.06.2024-10.06.2024-15.06.2024')).toThrow(
			'Invalid format',
		);
	});

	it('throws on missing start date', () => {
		expect(() => parseRange('-10.06.2024')).toThrow('Invalid format');
	});

	it('throws on missing end date', () => {
		expect(() => parseRange('01.06.2024-')).toThrow('Invalid format');
	});

	it('throws if parseDate returns falsy for start', async () => {
		const { mockParseDate } = await setup();
		mockParseDate.mockImplementationOnce(() => null);
		mockParseDate.mockImplementationOnce(() => 'parsed-end');
		expect(() => parseRange('01.06.2024-10.06.2024')).toThrow('Invalid format');
	});

	it('throws if parseDate returns falsy for end', async () => {
		const { mockParseDate } = await setup();
		mockParseDate.mockImplementationOnce(() => 'parsed-start');
		mockParseDate.mockImplementationOnce(() => undefined);
		expect(() => parseRange('01.06.2024-10.06.2024')).toThrow('Invalid format');
	});

	it('throws if makeDate returns falsy for start', async () => {
		const { mockParseDate, mockMakeDate } = await setup();
		mockParseDate.mockImplementation(() => 'parsed');
		mockMakeDate.mockImplementationOnce(() => null);
		mockMakeDate.mockImplementationOnce(() => new Date());
		expect(() => parseRange('01.06.2024-10.06.2024')).toThrow('Invalid date');
	});

	it('throws if makeDate returns falsy for end', async () => {
		const { mockParseDate, mockMakeDate } = await setup();
		mockParseDate.mockImplementation(() => 'parsed');
		mockMakeDate.mockImplementationOnce(() => new Date());
		mockMakeDate.mockImplementationOnce(() => undefined);
		expect(() => parseRange('01.06.2024-10.06.2024')).toThrow('Invalid date');
	});

	it('throws if end date is before start date', async () => {
		const { mockParseDate, mockMakeDate } = await setup();
		mockParseDate.mockImplementation(() => 'parsed');
		const fakeStart = new Date('2024-06-10');
		const fakeEnd = new Date('2024-06-01');
		mockMakeDate.mockImplementationOnce(() => fakeStart);
		mockMakeDate.mockImplementationOnce(() => fakeEnd);
		expect(() => parseRange('10.06.2024-01.06.2024')).toThrow(
			'End date before start',
		);
	});

	it('throws if days > 21', async () => {
		const { mockParseDate, mockMakeDate, mockDifferenceInCalendarDays } =
			await setup();
		mockParseDate.mockImplementation(() => 'parsed');
		const fakeStart = new Date('2024-06-01');
		const fakeEnd = new Date('2024-06-30');
		mockMakeDate.mockImplementationOnce(() => fakeStart);
		mockMakeDate.mockImplementationOnce(() => fakeEnd);
		mockDifferenceInCalendarDays.mockReturnValue(30);
		expect(() => parseRange('01.06.2024-30.06.2024')).toThrow(
			'Range exceeds 21 days',
		);
	});

	it('accepts any dash character as separator', async () => {
		const { mockParseDate, mockMakeDate, mockDifferenceInCalendarDays } =
			await setup();
		mockParseDate.mockImplementation(() => 'parsed');
		const fakeStart = new Date('2024-06-01');
		const fakeEnd = new Date('2024-06-10');
		mockDifferenceInCalendarDays.mockReturnValue(9);

		const inputs = [
			'01.06.2024-10.06.2024',
			'01.06.2024–10.06.2024',
			'01.06.2024—10.06.2024',
			'01.06   —    10.06',
		];

		for (const input of inputs) {
			mockMakeDate.mockImplementationOnce(() => fakeStart);
			mockMakeDate.mockImplementationOnce(() => fakeEnd);

			const result = parseRange(input);
			expect(result).toEqual({
				start: fakeStart,
				end: fakeEnd,
				days: 10,
				input,
			});
		}
	});
});
