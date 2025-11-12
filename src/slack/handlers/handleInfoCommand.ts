import { config } from '../../config/env';
import { logger } from '../../config/logger';
import { employeeInfoBlocks } from '../blocks/employeeInfoBlocks';
import { HRInfoBlocks } from '../blocks/HRInfoBlocks';
import type { CommandMiddleware } from '../../types/handler';

export const handleInfoCommand: CommandMiddleware = async ({
	ack,
	body,
	client,
}) => {
	try {
		await ack();

		const isHrChannel = body.channel_id === config.hrChannelId;

		if (isHrChannel) {
			await client.chat.postMessage({
				channel: body.channel_id,
				text: 'HR Info',
				blocks: HRInfoBlocks(),
			});
			return;
		}

		await client.chat.postMessage({
			channel: body.user_id,
			text: 'Your leave information',
			blocks: employeeInfoBlocks(),
		});
	} catch (error) {
		logger.error('Error handling /info command', { error });
	}
};
