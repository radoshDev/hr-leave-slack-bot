import type { Block, KnownBlock } from '@slack/types';
import { app } from './client';

type Blocks = (KnownBlock | Block)[] | undefined;

export async function postToChannel(
	channel: string,
	text: string,
	blocks?: Blocks,
) {
	return app.client.chat.postMessage({ channel, text, blocks });
}

export async function postDM(userId: string, text: string, blocks?: Blocks) {
	const { channel } = await app.client.conversations.open({ users: userId });

	if (!channel?.id) throw new Error('Failed to open channel');

	return app.client.chat.postMessage({ channel: channel.id, text, blocks });
}
