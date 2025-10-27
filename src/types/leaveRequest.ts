import type { LeaveType } from '@prisma/client';

export type LeaveRequestInput = {
	userId: string;
	startDate: Date;
	endDate: Date;
	days: number;
	year: number;
	type: LeaveType;
};
