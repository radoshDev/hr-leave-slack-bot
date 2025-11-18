import { EMOJI } from './emoji';
import { leaveTypesText } from './leaveTypeMessages';
import type { LeaveType } from '@prisma/client';

type DateRange = { startDate: string; endDate: string; leaveType: LeaveType };

export const errorMessages = {
	invalidDate:
		'❌ _Invalid date format. Use _`dd.MM - dd.MM` _or_ `dd.MM.yyyy - dd.MM.yyyy`.',
	invalidRange: '⏩ _End date must be after start date_',
	pastDate: '⏳ _The requested dates are in the past_',
	unableToParse: '🤔 _Unable to parse the provided date range_',
	systemError: '💥 _A system error occurred. Please try again later._',
	overlappingLeaveRequest({ startDate, endDate, leaveType }: DateRange) {
		return `${EMOJI.stop} You already have a ${EMOJI[leaveType]} ${leaveTypesText[leaveType]} request in this date range ${startDate} - ${endDate}. Need the details? Run \`/info\` to review your requests.`;
	},
};
