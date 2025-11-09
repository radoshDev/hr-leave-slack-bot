import { formatDate } from '../utils/formatDate';
import { EMOJI } from './emoji';
import { leaveTypesText } from './leaveTypeMessages';
import type { LeaveRequest } from '@prisma/client';
import type { LeaveDecision } from '../types/handler';
import { LEAVE_LIMITS } from '../config/leavePolicy';

type SentToHrPrams = Pick<LeaveRequest, 'type' | 'startDate' | 'endDate'> & {
	bookedDays: number;
};

export const responseMessages = {
	sentToHr: ({
		type,
		startDate,
		endDate,
		bookedDays,
	}: SentToHrPrams): string => {
		return `${EMOJI.APPROVED} Your ${leaveTypesText[type].toLowerCase()} request from ${formatDate(startDate, 'dd.MM.yyyy')} to ${formatDate(endDate, 'dd.MM.yyyy')} has been sent to HR for approval.\n You have ${bookedDays} ${leaveTypesText[type].toLowerCase()} of ${LEAVE_LIMITS[type]} days booked this year.`;
	},
	canceled: `${EMOJI.REJECTED} Canceled`,
	decision: ({ requestData, hrUserId, status }: LeaveDecision): string => {
		const { startDate, endDate, type } = requestData;

		return `${EMOJI[type]} Your leave request (${formatDate(startDate, 'dd.MM.yyyy')} – ${formatDate(endDate, 'dd.MM.yyyy')}) has been *${leaveTypesText[status]}* by <@${hrUserId}>.`;
	},
};
