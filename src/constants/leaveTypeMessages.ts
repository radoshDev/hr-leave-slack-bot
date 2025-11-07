import type { LeaveType } from '@prisma/client';

export const leaveTypesText: Record<LeaveType, string> = {
	VACATION: '🌴 Vacation',
	SICK_LEAVE: '🤒 Sick Leave',
	UNPAID: '🪑 Unpaid Leave',
};
