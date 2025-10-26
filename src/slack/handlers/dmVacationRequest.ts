import type { BlockButtonAction } from '@slack/bolt';
import { config } from '../../config/env';
import { parseRange } from '../../features/parseRange';
import { postToChannel } from '../api';
import { getHrBlocks } from '../blocks/getHrBlocks';
import { getPreviewBlocks } from '../blocks/getPreviewBlocks';
import { app } from '../client';
import { errorMessages } from '../../constants/errorMessages';

export function registerDmVacationRequest() {
	app.event('message', async ({ event, client, say }) => {
		if (event.channel_type !== 'im') return;
		if (event.subtype) return;

		const userId = event.user;
		const text = event.text?.trim();

		if (!userId || !text) return;

		try {
			const parsed = parseRange(text);
			const blocks = getPreviewBlocks({ userId, ...parsed });
			await client.chat.postMessage({
				channel: event.channel,
				text: 'Preview',
				blocks,
			});
		} catch (e) {
			const errorMessage =
				e instanceof Error && e.message ? e.message : errorMessages.invalidDate;
			await say(errorMessage);
		}
	});

	app.action<BlockButtonAction>(
		'vacation_send',
		async ({ ack, action, body, client }) => {
			await ack();

			if (!action?.value) return;

			const { userId, start, end, days } = JSON.parse(action.value);
			const blocks = getHrBlocks({
				userId,
				start: new Date(start),
				end: new Date(end),
				days,
			});
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
		},
	);

	app.action<BlockButtonAction>(
		'vacation_cancel',
		async ({ ack, body, client }) => {
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
		},
	);
}
