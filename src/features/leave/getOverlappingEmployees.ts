import { Status } from '@prisma/client';
import { prisma } from '../../db/prisma';

export type OverlappingEmployee = {
	userId: string;
	startDate: Date;
	endDate: Date;
};

type GetOverlappingEmployees = (args: {
	userId: string;
	startDate: Date;
	endDate: Date;
}) => Promise<OverlappingEmployee[]>;

export const getOverlappingEmployees: GetOverlappingEmployees = async ({
	userId,
	startDate,
	endDate,
}) => {
	const requests = await prisma.leaveRequest.findMany({
		where: {
			userId: { not: userId },
			status: { in: [Status.PENDING, Status.APPROVED] },
			startDate: { lte: endDate },
			endDate: { gte: startDate },
		},
		select: { userId: true, startDate: true, endDate: true },
		distinct: ['userId'],
	});

	return requests;
};
