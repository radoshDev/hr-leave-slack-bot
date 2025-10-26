import type { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import { parseRange } from '../../features/parseRange';
import { getPreviewBlocks } from '../blocks/getPreviewBlocks';
import { errorMessages } from '../../constants/errorMessages';

type HandleMessage = Middleware<SlackEventMiddlewareArgs<'message'>>;

export const handleMessage: HandleMessage = async ({ event, client, say }) => {
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
};
