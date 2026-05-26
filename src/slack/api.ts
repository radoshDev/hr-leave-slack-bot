import { config } from '../config/env';
import { HRPreviewBlocks } from './blocks/HRPreviewBlocks';
import { app } from './client';
import type { LeaveRequest } from '@prisma/client';
import type { Blocks } from '../types/handler';

import type { OverlappingEmployee } from '../features/leave/getOverlappingEmployees';

type PostToChannelArgs = {
	requestData: LeaveRequest;
	overlappingEmployees: OverlappingEmployee[];
};

type PostDMArgs = {
	userId: string;
	text: string;
	blocks?: Blocks;
};

export const api = {
	postToHrChannel: async ({ requestData, overlappingEmployees }: PostToChannelArgs) => {
		return app.client.chat.postMessage({
			channel: config.hrChannelId,
			text: 'New leave request submitted',
			blocks: [
				{ type: 'header', text: { type: 'plain_text', text: 'Leave request' } },
				...HRPreviewBlocks({ requestData, overlappingEmployees }),
			],
		});
	},
	postDM: async ({ userId, text, blocks }: PostDMArgs) => {
		const { channel } = await app.client.conversations.open({ users: userId });

		if (!channel?.id) throw new Error('Failed to open DM channel');

		return app.client.chat.postMessage({ channel: channel.id, text, blocks });
	},
};
