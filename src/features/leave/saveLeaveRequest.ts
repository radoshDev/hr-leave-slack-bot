import { Status } from '@prisma/client';
import { prisma } from '../../db/prisma';
import type { LeaveRequestInput } from '../../types/leaveRequest';

export async function saveLeaveRequest(input: LeaveRequestInput) {
	const { userId, days, year, type } = input;

	const startDate = new Date(input.startDate);
	const endDate = new Date(input.endDate);

	const overlapping = await prisma.leaveRequest.findFirst({
		where: {
			userId,
			status: { in: [Status.PENDING, Status.APPROVED] },
			OR: [
				{
					startDate: { lte: endDate },
					endDate: { gte: startDate },
				},
			],
		},
	});

	if (overlapping) return false;

	return prisma.leaveRequest.create({
		data: {
			userId,
			startDate,
			endDate,
			days,
			year,
			type,
			status: Status.PENDING,
		},
	});
}
