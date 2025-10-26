import type { ActionMiddleware } from '../../types/handler';

export const handleVacationCancel: ActionMiddleware = async ({
	ack,
	body,
	client,
}) => {
	await ack();
	if (body.channel?.id && body.message?.ts) {
		await client.chat.update({
			channel: body.channel.id,
			ts: body.message.ts,
			text: 'Canceled',
			blocks: [
				{ type: 'section', text: { type: 'mrkdwn', text: '❌ Canceled' } },
			],
		});
	}
};
