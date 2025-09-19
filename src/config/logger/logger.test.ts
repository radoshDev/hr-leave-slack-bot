import { describe, expect, it, vi } from 'vitest';
import { logger } from './index';
import { emitLog } from './emitLog';

vi.mock('./emitLog', () => ({ emitLog: vi.fn() }));

describe('logger', () => {
	it('forwards methods to emitLog with correct level', () => {
		logger.debug('a');
		logger.info('b');
		logger.warn('c');
		logger.error('d');

		expect(emitLog).toHaveBeenNthCalledWith(1, 'debug', 'a');
		expect(emitLog).toHaveBeenNthCalledWith(2, 'info', 'b');
		expect(emitLog).toHaveBeenNthCalledWith(3, 'warn', 'c');
		expect(emitLog).toHaveBeenNthCalledWith(4, 'error', 'd');
	});

	it('is frozen', () => {
		expect(Object.isFrozen(logger)).toBe(true);
	});
});
