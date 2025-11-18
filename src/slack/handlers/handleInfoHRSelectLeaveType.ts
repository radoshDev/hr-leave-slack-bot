import { logger } from '../../config/logger';
import { HRInfoLeaveButtons } from '../blocks/elements/HRInfoLeaveButtons';
import type { LeaveType } from '@prisma/client';
import type { KnownBlock } from '@slack/types';
import type { SelectMiddleware } from '../../types/handler';

export const handleInfoHRSelectLeaveType: SelectMiddleware = async ({
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
			if (block.type === 'actions' && block.block_id === 'hr_leave_buttons') {
				return {
					...block,
					elements: HRInfoLeaveButtons({
						leaveType: selectedLeaveType as LeaveType,
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
		logger.error('Error handling HR leave type selection:', error);
	}
};
