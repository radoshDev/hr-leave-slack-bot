import { LEAVE_LIMITS } from '../config/leavePolicy';
import { formatDate } from '../utils/formatDate';
import { EMOJI } from './emoji';
import { leaveTypesText } from './leaveTypeMessages';
import type { LeaveRequest } from '@prisma/client';
import type { LeaveDecision } from '../types/handler';

type SentToHrPrams = Pick<
	LeaveRequest,
	'type' | 'startDate' | 'endDate' | 'days'
> & {
	bookedDays: number;
};

export const responseMessages = {
	sentToHr: ({
		type,
		startDate,
		endDate,
		days,
		bookedDays,
	}: SentToHrPrams): string => {
		return `${EMOJI.PENDING} Your ${leaveTypesText[type].toLowerCase()} request (${formatDate(startDate, 'dd.MM.yyyy')} - ${formatDate(endDate, 'dd.MM.yyyy')}, ${days} days) has been sent to HR for approval.\n Used: *${bookedDays}* / *${LEAVE_LIMITS[type]}* days this year.`;
	},
	canceled: `${EMOJI.REJECTED} Canceled`,
	decisionEmployee: ({
		requestData,
		hrUserId,
		status,
	}: LeaveDecision): string => {
		const { startDate, endDate, type, days } = requestData;

		return `${EMOJI[status]} Your ${EMOJI[type]} ${leaveTypesText[type]} request (${formatDate(startDate, 'dd.MM.yyyy')} – ${formatDate(endDate, 'dd.MM.yyyy')}, ${days} days) has been *${leaveTypesText[status].toLowerCase()}* ${EMOJI[status]} by <@${hrUserId}>.`;
	},
	decisionHR: ({ requestData, hrUserId, status }: LeaveDecision): string => {
		const { userId, startDate, endDate, days, type: leaveType } = requestData;
		return `_${EMOJI[leaveType]} ${leaveTypesText[leaveType]} request for <@${userId}> (${formatDate(startDate, 'dd.MM.yyyy')} - ${formatDate(endDate, 'dd.MM.yyyy')}, ${days} days) has been *${leaveTypesText[status].toLowerCase()}* ${EMOJI[status]} by <@${hrUserId}>_.`;
	},
};
