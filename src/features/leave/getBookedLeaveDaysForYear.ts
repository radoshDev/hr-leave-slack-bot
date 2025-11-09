import { type LeaveType, Status } from '@prisma/client';
import { prisma } from '../../db/prisma';

interface GetBookedLeaveDaysParams {
	userId: string;
	leaveType: LeaveType;
	year?: number;
}

export async function getBookedLeaveDaysForYear({
	userId,
	leaveType,
	year = new Date().getFullYear(),
}: GetBookedLeaveDaysParams): Promise<number> {
	const requests = await prisma.leaveRequest.findMany({
		where: {
			userId,
			year,
			status: { in: [Status.APPROVED, Status.PENDING] },
			type: leaveType,
		},
		select: { days: true },
	});

	return requests.reduce((sum, r) => sum + r.days, 0);
}
