import { Status } from '@prisma/client';
import { errorMessages } from '../../constants/errorMessages';
import { prisma } from '../../db/prisma';
import type { LeaveRequestInput } from '../../types/leaveRequest';

export async function saveLeaveRequest(input: LeaveRequestInput) {
	const { userId, startDate, endDate, days, year, type } = input;

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

	if (overlapping) {
		throw new Error(errorMessages.overlappingLeaveRequest);
	}

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
