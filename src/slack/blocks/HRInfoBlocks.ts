import { LeaveType } from '@prisma/client';
import { EMOJI } from '../../constants/emoji';
import { EVENT_KEYS } from '../../constants/eventKeys';
import { leaveTypesText } from '../../constants/leaveTypeMessages';
import type { Blocks } from '../../types/handler';

export const HRInfoBlocks = (): Blocks => {
	return [
		{
			type: 'header',
			text: { type: 'plain_text', text: 'Dashboard' },
		},
		{
			type: 'section',
			text: { type: 'mrkdwn', text: '*Select leave type:*' },
			accessory: {
				type: 'static_select',
				action_id: EVENT_KEYS.INFO_HR_SELECT_LEAVE_TYPE,
				placeholder: {
					type: 'plain_text',
					text: `${EMOJI.VACATION} ${leaveTypesText.VACATION}`,
				},
				options: [
					LeaveType.VACATION,
					LeaveType.SICK_LEAVE,
					LeaveType.UNPAID,
				].map((leaveType) => ({
					text: {
						type: 'plain_text',
						text: `${EMOJI[leaveType]} ${leaveTypesText[leaveType]}`,
					},
					value: LeaveType[leaveType],
				})),
			},
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: 'Select an option to view leave requests:',
			},
		},
		{
			type: 'actions',
			elements: [
				{
					type: 'button',
					text: { type: 'plain_text', text: '📋 All Requests' },
					action_id: 'hr_all_requests',
				},
				{
					type: 'button',
					text: { type: 'plain_text', text: '🕓 Pending Approvals' },
					action_id: 'hr_pending_requests',
				},
				{
					type: 'button',
					text: { type: 'plain_text', text: '✅ Approved' },
					action_id: 'hr_approved_requests',
				},
				{
					type: 'button',
					text: { type: 'plain_text', text: '❌ Rejected' },
					action_id: 'hr_rejected_requests',
				},
			],
		},
	];
};
