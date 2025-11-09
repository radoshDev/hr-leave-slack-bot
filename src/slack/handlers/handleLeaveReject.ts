import { Status } from '@prisma/client';
import { logger } from '../../config/logger';
import { responseMessages } from '../../constants/responseMessages';
import { prisma } from '../../db/prisma';
import { api } from '../api';
import { getLeaveDecisionBlocks } from '../blocks/getLeaveDecisionBlocks';
import type { ActionMiddleware } from '../../types/handler';

export const handleLeaveReject: ActionMiddleware = async ({
	ack,
	action,
	body,
	client,
}) => {
	try {
		await ack();

		if (!action.value || !body.channel?.id || !body.message?.ts) return;

		const requestId = Number(action.value);
		const hrUserId = body.user.id;

		const requestData = await prisma.leaveRequest.update({
			where: { id: requestId },
			data: { status: Status.REJECTED },
		});

		await api.postDM({
			userId: requestData.userId,
			text: responseMessages.decision({
				requestData,
				hrUserId,
				status: Status.REJECTED,
			}),
		});

		await client.chat.update({
			channel: body.channel.id,
			ts: body.message.ts,
			blocks: getLeaveDecisionBlocks({
				hrUserId,
				requestData,
				status: Status.REJECTED,
			}),
		});
	} catch (error) {
		logger.error('Error in handleLeaveReject', error);
	}
};
