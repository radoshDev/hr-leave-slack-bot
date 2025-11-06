import { leaveTypes } from '../../constants/leaveTypes';
import { STATUS_CONFIG } from '../../constants/responseMessages';
import { formatDate } from '../../utils/formatDate';
import type { Blocks, LeaveDecision } from '../../types/handler';

const getLeaveDecisionBlocks = ({
	hrUserId,
	requestData,
	status,
}: LeaveDecision): Blocks => {
	const { emoji, resultLabel } = STATUS_CONFIG[status];
	const { userId, endDate, startDate, days, type: leaveType } = requestData;

	return [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: [
					`${emoji} ${resultLabel} by <@${hrUserId}>`,
					`👤 *Employee:* <@${userId}>`,
					`📅 *Period:* ${formatDate(startDate, 'dd.MM.yyyy')} — ${formatDate(endDate, 'dd.MM.yyyy')} (${days} days)`,
					`🗓 *Type:* ${leaveTypes[leaveType]}`,
				].join('\n'),
			},
		},
	];
};

export { getLeaveDecisionBlocks };
