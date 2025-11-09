import type { LeaveTypeWithStatus } from '../types/leaveRequest';

type Key = LeaveTypeWithStatus | 'employee' | 'type' | 'period' | 'days';

export const EMOJI: Record<Key, string> = {
	VACATION: '🌴',
	SICK_LEAVE: '🤒',
	UNPAID: '💸',
	APPROVED: '✅',
	REJECTED: '❌',
	PENDING: '⏳',
	employee: '👤',
	type: '🗓',
	period: '📅',
	days: '⏳',
};
