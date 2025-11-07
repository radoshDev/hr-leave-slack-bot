import { logger } from '../../config/logger';
import { EVENT_KEYS } from '../../constants/eventKeys';
import type { Button, KnownBlock } from '@slack/types';
import type { SelectMiddleware } from '../../types/handler';

export const handleSelectLeaveType: SelectMiddleware = async ({
	ack,
	body,
	action,
	client,
}) => {
	try {
		await ack();

		const selectedLeaveType = action.selected_option?.value;

		if (!selectedLeaveType) throw new Error('No leave type selected');
		if (!body.channel?.id) throw new Error('No channel ID found');
		if (!body.message || !('blocks' in body.message))
			throw new Error('No message blocks found');

		const messageBlocks: KnownBlock[] = body.message.blocks;

		const newBlocks = messageBlocks.map((block) => {
			if (block.type === 'actions') {
				return {
					...block,
					elements: block.elements.map((el) => {
						const element = el as Button;

						if (element.action_id !== EVENT_KEYS.LEAVE_REQUEST_SEND) return el;

						const prevValue = JSON.parse(element.value || '{}');
						const newValue = JSON.stringify({
							...prevValue,
							type: selectedLeaveType,
						});

						return {
							...element,
							value: newValue,
						};
					}),
				};
			}
			return block;
		});

		await client.chat.update({
			channel: body.channel.id,
			ts: body.message.ts,
			blocks: newBlocks,
			text: 'Leave type updated',
		});
	} catch (error) {
		logger.error('Error handling leave type selection:', error);
	}
};
