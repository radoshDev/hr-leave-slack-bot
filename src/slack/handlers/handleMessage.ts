import { errorMessages } from '../../constants/errorMessages';
import { parseRange } from '../../features/parseRange';
import { employeeRequestPreviewBlocks } from '../blocks/employeeRequestPreviewBlocks';
import type { MessageMiddleware } from '../../types/handler';

export const handleMessage: MessageMiddleware = async ({
	event,
	client,
	say,
}) => {
	if (event.channel_type !== 'im') return;
	if (event.subtype) return;
	if (!event.text || !event.user) return;

	try {
		const parsedRange = parseRange(event.text.trim());

		await client.chat.postMessage({
			channel: event.channel,
			text: 'Leave request preview',
			blocks: employeeRequestPreviewBlocks({
				userId: event.user,
				...parsedRange,
			}),
		});
	} catch (e) {
		const errorMessage =
			e instanceof Error && e.message ? e.message : errorMessages.invalidDate;
		await say(errorMessage);
	}
};
