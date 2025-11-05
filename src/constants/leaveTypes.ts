import type { LeaveType } from '@prisma/client';

export const leaveTypes: Record<LeaveType, string> = {
	VACATION: 'Vacation',
	SICK_LEAVE: 'Sick Leave',
	UNPAID: 'Unpaid Vacation',
};
