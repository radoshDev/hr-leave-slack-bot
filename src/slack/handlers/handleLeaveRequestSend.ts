import { config } from '../../config/env';
import { logger } from '../../config/logger';
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
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			days,
			year,
			type,
		};

		const blocks = getHrBlocks(data);

		await saveLeaveRequest(data);

		await postToChannel(config.hrChannelId, 'Vacation request', blocks);

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
