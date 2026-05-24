import { type LeaveRequest, Status } from '@prisma/client';
import {
	LEAVE_LIMITS,
	MAX_VACATION_DAYS_PER_REQUEST,
} from '../../config/leavePolicy';
import { errorMessages } from '../../constants/errorMessages';
import { prisma } from '../../db/prisma';
import { getBookedLeaveDaysForYear } from './getBookedLeaveDaysForYear';
import type { LeaveRequestInput } from '../../types/leaveRequest';

type SaveLeaveRequest = (input: LeaveRequestInput) => Promise<LeaveRequest>;

export const saveLeaveRequest: SaveLeaveRequest = async (input) => {
	const { userId, days, year, type } = input;

	if (type === 'VACATION') {
		if (days > MAX_VACATION_DAYS_PER_REQUEST)
			throw new Error(errorMessages.vacationRequestTooLong);

		const bookedDays = await getBookedLeaveDaysForYear({
			userId,
			leaveType: type,
			year,
		});

		if (days + bookedDays > LEAVE_LIMITS[type])
			throw new Error(errorMessages.vacationAnnualLimitExceeded(bookedDays));
	}

	const startDate = new Date(input.startDate);
	const endDate = new Date(input.endDate);

	const overlapping = await prisma.leaveRequest.findFirst({
		where: {
			userId,
			status: { in: [Status.PENDING, Status.APPROVED] },
			type,
			OR: [
				{
					startDate: { lte: endDate },
					endDate: { gte: startDate },
				},
			],
		},
	});

	if (overlapping)
		throw new Error(
			errorMessages.overlappingLeaveRequest({
				startDate,
				endDate,
				leaveType: type,
			}),
		);

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
