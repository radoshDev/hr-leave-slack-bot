import type { LeaveType, Status } from '@prisma/client';

type CustomKey = 'employee' | 'type' | 'period' | 'days' | 'stop';

type Key = LeaveType | Status | CustomKey;

export const EMOJI: Record<Key, string> = {
	VACATION: '🌴',
	SICK_LEAVE: '🤒',
	APPROVED: '✅',
	REJECTED: '❌',
	PENDING: '⏳',
	employee: '👤',
	type: '🗓',
	period: '📅',
	days: '⏳',
	stop: '🛑',
};
