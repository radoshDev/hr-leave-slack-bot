import { config } from '../../config/env';
import { logger } from '../../config/logger';
import { errorMessages } from '../../constants/errorMessages';
import { saveLeaveRequest } from '../../features/leave/saveLeaveRequest';
import type { ActionMiddleware } from '../../types/handler';
import type { LeaveRequestInput } from '../../types/leaveRequest';
import { postToChannel } from '../api';
import { getHrBlocks } from '../blocks/getHrBlocks';

export const handleVacationSend: ActionMiddleware = async ({
	ack,
	action,
	body,
	client,
}) => {
	try {
		if (!action?.value || !body.channel?.id || !body.message?.ts) return;

		await ack();

		const { userId, startDate, endDate, days, year, type } = JSON.parse(
			action.value,
		) as LeaveRequestInput;

		const data = {
			userId,
			startDate,
			endDate,
			days,
			year,
			type,
		};

		const result = await saveLeaveRequest(data);

		if (result === false) {
			await client.chat.update({
				channel: body.channel.id,
				ts: body.message.ts,
				text: 'Error',
				blocks: [
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text: errorMessages.overlappingLeaveRequest,
						},
					},
				],
			});
			return;
		}

		await postToChannel(
			config.hrChannelId,
			'Vacation request',
			getHrBlocks(data),
		);

		await client.chat.update({
			channel: body.channel.id,
			ts: body.message.ts,
			text: 'Sent',
			blocks: [
				{
					type: 'section',
					text: { type: 'mrkdwn', text: '✅ Sent to HR' },
				},
			],
		});
	} catch (error) {
		logger.error('Error in handleVacationSend:', error);
	}
};
