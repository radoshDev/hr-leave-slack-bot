import { responseMessages } from '../../constants/responseMessages';
import type { Blocks, LeaveDecision } from '../../types/handler';

export const HRRequestDecisionBlocks = ({
	hrUserId,
	requestData,
	status,
}: LeaveDecision): Blocks => {
	return [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: responseMessages.decisionHR({ requestData, hrUserId, status }),
			},
		},
	];
};
