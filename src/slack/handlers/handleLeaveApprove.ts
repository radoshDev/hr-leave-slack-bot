import { Status } from '@prisma/client';
import { logger } from '../../config/logger';
import { prisma } from '../../db/prisma';
import type { ActionMiddleware } from '../../types/handler';
import { formatDate } from '../../utils/formatDate';
import { postDM } from '../api';

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
		const request = await prisma.leaveRequest.update({
			where: { id: requestId },
			data: { status: Status.APPROVED },
		});

		const msg = [
			`✅ *Approved by* <@${hrUserId}>`,
			`👤 *Employee:* <@${request.userId}>`,
			`📅 *Period:* ${formatDate(request.startDate, 'dd.MM.yyyy')} — ${formatDate(request.endDate, 'dd.MM.yyyy')} (${request.days} days)`,
			`🗓 *Type:* ${request.type.replace('_', ' ').toLowerCase()}`,
		].join('\n');

		await postDM(
			request.userId,
			`✅ Your leave request (${formatDate(
				request.startDate,
				'dd.MM.yyyy',
			)} – ${formatDate(
				request.endDate,
				'dd.MM.yyyy',
			)}) has been *approved* by <@${hrUserId}>`,
		);
		await client.chat.update({
			channel: body.channel.id,
			ts: body.message.ts,
			text: 'Approved',
			blocks: [
				{
					type: 'section',
					text: { type: 'mrkdwn', text: msg },
				},
			],
		});
	} catch (error) {
		logger.error('Error in handleLeaveApprove', error);
	}
};
