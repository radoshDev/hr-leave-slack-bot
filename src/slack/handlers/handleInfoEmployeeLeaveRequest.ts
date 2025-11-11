import { type LeaveType, Status } from '@prisma/client';
import { LEAVE_LIMITS } from '../../config/leavePolicy';
import { logger } from '../../config/logger';
import { EMOJI } from '../../constants/emoji';
import { leaveTypesText } from '../../constants/leaveTypeMessages';
import { prisma } from '../../db/prisma';
import { formatDate } from '../../utils/formatDate';
import type { ActionMiddleware } from '../../types/handler';

export const handleInfoEmployeeLeaveRequest: ActionMiddleware = async ({
	ack,
	body,
	client,
	action,
}) => {
	try {
		await ack();
		const userId = body.user.id;
		const tsMessage = body.message?.ts;
		const channelId = body.channel?.id;
		const leaveType = action.value as LeaveType | undefined;
		const year = new Date().getFullYear();

		if (!leaveType) throw new Error('Leave type not provided in action value');
		if (!tsMessage || !channelId)
			throw new Error(
				'Message timestamp or channel ID not found in action body',
			);

		const leaves = await prisma.leaveRequest.findMany({
			where: {
				userId,
				year,
				type: leaveType,
				status: { in: [Status.APPROVED, Status.PENDING] },
			},
			orderBy: { startDate: 'asc' },
		});

		const usedDays = leaves.reduce((sum, l) => sum + l.days, 0);

		const list =
			leaves.length === 0
				? '_No requests found_'
				: leaves
						.map(
							(l) =>
								`• ${formatDate(l.startDate, 'dd.MM.yyyy')} — ${formatDate(
									l.endDate,
									'dd.MM.yyyy',
								)} (${l.days} days, ${l.status.toLowerCase()})`,
						)
						.join('\n');

		await client.chat.update({
			channel: channelId,
			ts: tsMessage,
			text: `${leaveTypesText[leaveType]} Info`,
			blocks: [
				{
					type: 'header',
					text: {
						type: 'plain_text',
						text: `${EMOJI[leaveType]} ${leaveTypesText[leaveType]} Requests`,
					},
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `*Used:* ${usedDays} / ${LEAVE_LIMITS[leaveType]} days in ${year}`,
					},
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: list,
					},
				},
			],
		});
	} catch (error) {
		logger.error('Error in handleLeaveRequestEmployeeInfo:', error);
	}
};
