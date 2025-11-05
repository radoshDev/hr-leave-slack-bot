import { formatDate } from '../../utils/formatDate';
import type { LeaveDecision } from '../../types/handler';
import { STATUS_CONFIG } from '../../constants/responseMessages';

export const getLeaveDecisionMessage = ({
	requestData,
	hrUserId,
	status,
}: LeaveDecision): string => {
	const { emoji, resultLabel, suffix } = STATUS_CONFIG[status];
	const { startDate, endDate } = requestData;

	return `${emoji} Your leave request (${formatDate(startDate, 'dd.MM.yyyy')} – ${formatDate(endDate, 'dd.MM.yyyy')}) has been ${resultLabel} by <@${hrUserId}>${suffix}`;
};
