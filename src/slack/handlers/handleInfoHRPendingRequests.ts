import { logger } from '../../config/logger';
import { leaveTypesText } from '../../constants/leaveTypeMessages';
import { prisma } from '../../db/prisma';
import { HRPreviewBlocks } from '../blocks/HRPreviewBlocks';
import type { LeaveType } from '@prisma/client';
import type { ActionMiddleware, Blocks } from '../../types/handler';

export const handleInfoHRPendingRequests: ActionMiddleware = async ({
	ack,
	action,
	body,
	client,
}) => {
	try {
		await ack();

		const leaveType = action.value as LeaveType | undefined;
		const channelId = body.channel?.id;
		if (!leaveType) throw new Error('Leave type not provided in action value');
		if (!channelId) throw new Error('Channel ID not found in action body');

		const pendingRequests = await prisma.leaveRequest.findMany({
			where: {
				type: leaveType,
				status: 'PENDING',
			},
			orderBy: { startDate: 'asc' },
		});

		const blocks: Blocks = [
			{
				type: 'header',
				text: {
					type: 'plain_text',
					text: `🕓 Pending ${leaveTypesText[leaveType]}`,
				},
			},
		];

		if (pendingRequests.length === 0) {
			blocks.push({
				type: 'section',
				text: { type: 'mrkdwn', text: '_No pending requests found._' },
			});
		} else {
			pendingRequests.forEach((request) => {
				blocks.push(...HRPreviewBlocks({ requestData: request, overlappingEmployees: [] }));
			});
		}

		await client.chat.postMessage({
			channel: channelId,
			text: 'Pending requests',
			blocks,
		});
	} catch (error) {
		logger.error('Error in handleInfoHRPendingRequests', error);
	}
};
