import { logger } from '../../config/logger';
import { errorMessages } from '../../constants/errorMessages';
import { responseMessages } from '../../constants/responseMessages';
import { saveLeaveRequest } from '../../features/leave/saveLeaveRequest';
import { api } from '../api';
import type { ActionMiddleware } from '../../types/handler';
import type { LeaveRequestInput } from '../../types/leaveRequest';

export const handleLeaveRequestSend: ActionMiddleware = async ({
	ack,
	action,
	body,
	client,
}) => {
	try {
		if (!action?.value || !body.channel?.id || !body.message?.ts) return;

		await ack();

		const { userId, startDate, endDate, days, year, type } = JSON.parse(
			action.value,
		) as LeaveRequestInput;

		const requestData = {
			userId,
			startDate,
			endDate,
			days,
			year,
			type,
		};

		const requestResult = await saveLeaveRequest(requestData);

		if (requestResult === false) {
			await client.chat.update({
				channel: body.channel.id,
				ts: body.message.ts,
				text: errorMessages.overlappingLeaveRequest,
			});
			return;
		}

		await api.postToHrChannel({
			requestData: requestResult,
		});

		await client.chat.update({
			channel: body.channel.id,
			ts: body.message.ts,
			text: responseMessages.sentToHr,
		});
	} catch (error) {
		logger.error('Error in handleVacationSend:', error);
	}
};
