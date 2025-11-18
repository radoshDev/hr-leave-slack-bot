import { Status } from '@prisma/client';
import { logger } from '../../config/logger';
import { responseMessages } from '../../constants/responseMessages';
import { prisma } from '../../db/prisma';
import { api } from '../api';
import { HRRequestDecisionBlocks } from '../blocks/HRRequestDecisionBlocks';
import type { ActionMiddleware } from '../../types/handler';

export const handleHRLeaveApprove: ActionMiddleware = async ({
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
			text: responseMessages.decisionEmployee({
				requestData,
				hrUserId,
				status: Status.APPROVED,
			}),
		});
		await client.chat.update({
			channel: body.channel.id,
			ts: body.message.ts,
			text: 'Approved',
			blocks: HRRequestDecisionBlocks({
				hrUserId,
				requestData,
				status: Status.APPROVED,
			}),
		});
	} catch (error) {
		logger.error('Error in handleLeaveApprove', error);
	}
};
