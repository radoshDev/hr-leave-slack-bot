import { app } from './client';
import { config } from '../config/env';
import type { Blocks } from '../types/handler';
import { getHrBlocks } from './blocks/getHrBlocks';
import type { LeaveRequest } from '@prisma/client';

type PostToChannelArgs = {
	requestData: LeaveRequest;
};

type PostDMArgs = {
	userId: string;
	text: string;
	blocks?: Blocks;
};

export const api = {
	postToHrChannel: async ({ requestData }: PostToChannelArgs) => {
		return app.client.chat.postMessage({
			channel: config.hrChannelId,
			blocks: getHrBlocks({ requestData }),
		});
	},
	postDM: async ({ userId, text, blocks }: PostDMArgs) => {
		const { channel } = await app.client.conversations.open({ users: userId });

		if (!channel?.id) throw new Error('Failed to open DM channel');

		return app.client.chat.postMessage({ channel: channel.id, text, blocks });
	},
};
