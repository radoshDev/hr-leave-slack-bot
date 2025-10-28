import type { LeaveType } from '@prisma/client';

export type LeaveRequestInput = {
	userId: string;
	startDate: string;
	endDate: string;
	days: number;
	year: number;
	type: LeaveType;
};
