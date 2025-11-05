import { Status, type LeaveRequest } from '@prisma/client';
import { prisma } from '../../db/prisma';
import type { LeaveRequestInput } from '../../types/leaveRequest';

type SaveLeaveRequest = (
	input: LeaveRequestInput,
) => Promise<false | LeaveRequest>;

export const saveLeaveRequest: SaveLeaveRequest = async (input) => {
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
};
