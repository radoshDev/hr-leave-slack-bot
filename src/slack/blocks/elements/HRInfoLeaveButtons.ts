import { EVENT_KEYS } from '../../../constants/eventKeys';
import { leaveTypesText } from '../../../constants/leaveTypeMessages';
import type { LeaveType } from '@prisma/client';
import type { Button } from '@slack/types';

type Props = { leaveType: LeaveType };

export const HRInfoLeaveButtons = ({ leaveType }: Props): Button[] => [
	{
		type: 'button',
		text: {
			type: 'plain_text',
			text: `📅 Upcoming Booked (${leaveTypesText[leaveType]})`,
		},
		action_id: EVENT_KEYS.INFO_HR_UPCOMING_REQUESTS,
		value: leaveType,
	},
	{
		type: 'button',
		text: {
			type: 'plain_text',
			text: `🕓 Pending Approvals (${leaveTypesText[leaveType]})`,
		},
		action_id: EVENT_KEYS.INFO_HR_PENDING_REQUESTS,
		value: leaveType,
	},
	{
		type: 'button',
		text: {
			type: 'plain_text',
			text: `📊 Report (${leaveTypesText[leaveType]})`,
		},
		action_id: EVENT_KEYS.INFO_HR_REPORT_REQUESTS,
		value: leaveType,
	},
];
