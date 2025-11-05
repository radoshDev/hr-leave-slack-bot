import type { LeaveDecisionStatus } from '../types/handler';

export const STATUS_CONFIG: Record<
	LeaveDecisionStatus,
	{ emoji: string; resultLabel: string; suffix: string }
> = {
	APPROVED: { emoji: '✅', resultLabel: '*approved*', suffix: '.' },
	REJECTED: { emoji: '❌', resultLabel: '*rejected*', suffix: '.' },
};

export const responseMessages = {
	sentToHr: '✅ Sent to HR',
	canceled: '❌ Canceled',
};
