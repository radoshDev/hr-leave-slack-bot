import type { LeaveTypeWithStatus } from '../types/leaveRequest';

export const leaveTypesText: Record<LeaveTypeWithStatus, string> = {
	VACATION: 'Vacation',
	SICK_LEAVE: 'Sick Leave',
	UNPAID: 'Unpaid Leave',
	APPROVED: 'Approved',
	REJECTED: 'Rejected',
	PENDING: 'Pending',
};
