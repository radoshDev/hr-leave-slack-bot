import {
	LEAVE_LIMITS,
	MAX_VACATION_DAYS_PER_REQUEST,
} from '../config/leavePolicy';
import { formatDate } from '../utils/formatDate';
import { EMOJI } from './emoji';
import { leaveTypesText } from './leaveTypeMessages';
import type { LeaveType } from '@prisma/client';

type DateRange = { startDate: Date; endDate: Date; leaveType: LeaveType };

export const errorMessages = {
	invalidDate:
		'❌ _Invalid date format. Use _`dd.MM - dd.MM` _or_ `dd.MM.yyyy - dd.MM.yyyy`.',
	invalidRange: '⏩ _End date must be after start date_',
	pastDate: '⏳ _The requested dates are in the past_',
	unableToParse: '🤔 _Unable to parse the provided date range_',
	systemError: '💥 _A system error occurred. Please try again later._',
	overlappingLeaveRequest({ startDate, endDate, leaveType }: DateRange) {
		return `${EMOJI.stop} You already have a ${EMOJI[leaveType]} ${leaveTypesText[leaveType]} request in this date range ${formatDate(startDate, 'dd.MM.yyyy')} - ${formatDate(endDate, 'dd.MM.yyyy')}. Need the details? Run \`/info\` to review your requests.`;
	},
	vacationRequestTooLong: `${EMOJI.stop} _A single vacation request cannot exceed *${MAX_VACATION_DAYS_PER_REQUEST} days*. Please split your request into smaller periods._`,
	vacationAnnualLimitExceeded(bookedDays: number) {
		const remaining = LEAVE_LIMITS.VACATION - bookedDays;
		return `${EMOJI.stop} _You don't have enough vacation days. You have *${remaining} day${remaining === 1 ? '' : 's'}* left for this year.`;
	},
};
