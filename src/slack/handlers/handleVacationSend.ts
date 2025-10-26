import { postToChannel } from '../api';
import { getHrBlocks } from '../blocks/getHrBlocks';
import { config } from '../../config/env';
import type { ActionMiddleware } from '../../types/handler';
import type { ParsedVacationWithUser } from '../../types/vacation';

export const handleVacationSend: ActionMiddleware = async ({
	ack,
	action,
	body,
	client,
}) => {
	await ack();

	if (!action?.value) return;

	const { userId, start, end, days } = JSON.parse(
		action.value,
	) as ParsedVacationWithUser;

	const data = { userId, start: new Date(start), end: new Date(end), days };

	const blocks = getHrBlocks(data);

	await postToChannel(config.hrChannelId, 'Vacation request', blocks);
	if (body.channel?.id && body.message?.ts) {
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
	}
};
