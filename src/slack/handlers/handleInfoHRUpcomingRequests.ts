import { logger } from '../../config/logger';
import { leaveTypesText } from '../../constants/leaveTypeMessages';
import { prisma } from '../../db/prisma';
import { formatDate } from '../../utils/formatDate';
import type { LeaveType } from '@prisma/client';
import type { ActionMiddleware } from '../../types/handler';

export const handleInfoHRUpcomingRequests: ActionMiddleware = async ({
	ack,
	action,
	body,
	client,
}) => {
	try {
		await ack();
		const leaveType = action.value as LeaveType | undefined;
		if (!leaveType) throw new Error('Leave type not provided in action value');

		const today = new Date();

		const listLimit = 10;
		const upcoming = await prisma.leaveRequest.findMany({
			where: {
				type: leaveType,
				startDate: { gte: today },
				status: { in: ['PENDING', 'APPROVED'] },
			},
			orderBy: { startDate: 'asc' },
			take: listLimit,
		});

		const list =
			upcoming.length === 0
				? '_No upcoming bookings found._'
				: upcoming
						.map(
							(r) =>
								`• <@${r.userId}> — ${formatDate(r.startDate, 'dd.MM.yyyy')} → ${formatDate(
									r.endDate,
									'dd.MM.yyyy',
								)} (${r.days} days, ${r.status.toLowerCase()})`,
						)
						.join('\n');

		await client.chat.postMessage({
			channel: body.channel?.id || body.user.id,
			text: 'Upcoming bookings',
			blocks: [
				{
					type: 'header',
					text: {
						type: 'plain_text',
						text: `📅 Upcoming ${leaveTypesText[leaveType]}s`,
					},
				},
				{
					type: 'section',
					text: { type: 'mrkdwn', text: list },
				},
			],
		});
	} catch (error) {
		logger.error('Error in handleInfoHRUpcomingRequests', error);
	}
};
