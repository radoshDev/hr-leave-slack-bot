import { logger } from '../../config/logger';
import type { ActionMiddleware } from '../../types/handler';

export const handleLeaveRequestCancel: ActionMiddleware = async ({
	ack,
	body,
	client,
}) => {
	try {
		if (!body.channel?.id || !body.message?.ts) {
			throw new Error('Missing channel ID or message timestamp');
		}

		await ack();
		await client.chat.update({
			channel: body.channel.id,
			ts: body.message.ts,
			text: 'Canceled',
			blocks: [
				{ type: 'section', text: { type: 'mrkdwn', text: '❌ Canceled' } },
			],
		});
	} catch (error) {
		logger.error('Error in handleVacationCancel:', error);
	}
};
