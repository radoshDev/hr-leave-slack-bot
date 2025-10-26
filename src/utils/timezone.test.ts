import { describe, expect, it } from 'vitest';
import { isValidTimeZone } from '../../src/utils/timezone';

describe('utils/timezone:isValidTimeZone', () => {
	const valid = [
		'Europe/Kyiv',
		'Europe/Kiev',
		'europe/Kyiv',
		'Europe/kyiv',
		'UTC',
		'Etc/UTC',
		'America/New_York',
		'Asia/Tokyo',
	];
	const invalid = ['Kyiv', 'Not/AZone', '', ' ', '123', 'GMT+2', 'UTC+2'];

	valid.forEach((tz) => {
		it(`returns true for valid IANA zone: ${tz}`, () => {
			expect(isValidTimeZone(tz)).toBe(true);
		});
	});

	invalid.forEach((tz) => {
		it(`returns false for invalid IANA zone: ${tz}`, () => {
			expect(isValidTimeZone(tz)).toBe(false);
		});
	});

	it('does not throw on unusual inputs', () => {
		const weird: unknown[] = [
			null,
			undefined,
			0,
			true,
			{},
			[],
			' Europe/Kyiv ',
			'UTC ',
		];
		weird.forEach((v) => {
			expect(() => isValidTimeZone(v as string)).not.toThrow();
		});
	});
});
