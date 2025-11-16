import { LeaveType } from '@prisma/client';
import { EMOJI } from '../../constants/emoji';
import { EVENT_KEYS } from '../../constants/eventKeys';
import { leaveTypesText } from '../../constants/leaveTypeMessages';
import { HRInfoLeaveButtons } from './elements/HRInfoLeaveButtons';
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
				text: '*Manage leave requests and reports:*',
			},
		},
		{
			type: 'actions',
			elements: HRInfoLeaveButtons({ leaveType: LeaveType.VACATION }),
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: '*General Reports:*',
			},
		},
		{
			type: 'actions',
			elements: [
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: `Report for this year`,
					},
					action_id: 'info_hr_report_this_year',
				},
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: `Report for last year`,
					},
					action_id: 'info_hr_report_last_year',
				},
			],
		},
	];
};
