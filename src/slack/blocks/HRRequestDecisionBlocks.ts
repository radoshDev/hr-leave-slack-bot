import { EMOJI } from '../../constants/emoji';
import { leaveTypesText } from '../../constants/leaveTypeMessages';
import { formatDate } from '../../utils/formatDate';
import type { Blocks, LeaveDecision } from '../../types/handler';

export const HRRequestDecisionBlocks = ({
	hrUserId,
	requestData,
	status,
}: LeaveDecision): Blocks => {
	const { userId, endDate, startDate, days, type: leaveType } = requestData;

	return [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: [
					`${EMOJI.type} *Type:* ${EMOJI[leaveType]} ${leaveTypesText[leaveType]}`,
					`${EMOJI.employee} *Employee:* <@${userId}>`,
					`${EMOJI.period} *Period:* ${formatDate(startDate, 'dd.MM.yyyy')} — ${formatDate(endDate, 'dd.MM.yyyy')} (${days} days)`,
					`${EMOJI[status]} ${leaveTypesText[status]} by <@${hrUserId}>`,
				].join('\n'),
			},
		},
	];
};
