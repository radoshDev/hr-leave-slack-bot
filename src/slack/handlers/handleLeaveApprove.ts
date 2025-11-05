import { Status } from '@prisma/client';
import { logger } from '../../config/logger';
import { prisma } from '../../db/prisma';
import { api } from '../api';
import { getLeaveDecisionBlocks } from '../blocks/getLeaveDecisionBlocks';
import { getLeaveDecisionMessage } from '../messages/getLeaveDecisionMessage';
import type { ActionMiddleware } from '../../types/handler';

export const handleLeaveApprove: ActionMiddleware = async ({
	ack,
	action,
	body,
	client,
}) => {
	try {
		await ack();

		if (!action.value || !body.channel?.id || !body.message?.ts) return;
		const hrUserId = body.user.id;

		const requestId = Number(action.value);
		const requestData = await prisma.leaveRequest.update({
			where: { id: requestId },
			data: { status: Status.APPROVED },
		});

		await api.postDM({
			userId: requestData.userId,
			text: getLeaveDecisionMessage({
				requestData,
				hrUserId,
				status: Status.APPROVED,
			}),
		});
		await client.chat.update({
			channel: body.channel.id,
			ts: body.message.ts,
			text: 'Approved',
			blocks: getLeaveDecisionBlocks({
				hrUserId,
				requestData,
				status: Status.APPROVED,
			}),
		});
	} catch (error) {
		logger.error('Error in handleLeaveApprove', error);
	}
};
