import type { LeaveType } from '@prisma/client';

export const LEAVE_LIMITS: Record<LeaveType, number> = {
	VACATION: 21,
	SICK_LEAVE: 10,
} as const;

export const MAX_VACATION_DAYS_PER_REQUEST = 7;
