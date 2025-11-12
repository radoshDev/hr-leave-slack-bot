import { LeaveType } from '@prisma/client';
import { EMOJI } from '../../constants/emoji';
import { EVENT_KEYS } from '../../constants/eventKeys';
import { leaveTypesText } from '../../constants/leaveTypeMessages';
import type { Blocks } from '../../types/handler';

export const employeeInfoBlocks = (): Blocks => {
	return [
		{
			type: 'header',
			text: { type: 'plain_text', text: '🧾 Your Leave Information' },
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: [
					'*Select the type of leave information you want to view:*',
					'_This will provide you with details about your leave requests and balances for current year._',
				].join('\n'),
			},
		},
		{
			type: 'actions',
			elements: [
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: `${EMOJI.VACATION} ${leaveTypesText.VACATION} Requests`,
					},
					action_id: EVENT_KEYS.INFO_EMPLOYEE_VACATION,
					value: LeaveType.VACATION,
				},
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: `${EMOJI.SICK_LEAVE} ${leaveTypesText.SICK_LEAVE} Requests`,
					},
					action_id: EVENT_KEYS.INFO_EMPLOYEE_SICK,
					value: LeaveType.SICK_LEAVE,
				},
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: `${EMOJI.UNPAID} ${leaveTypesText.UNPAID} Requests`,
					},
					action_id: EVENT_KEYS.INFO_EMPLOYEE_UNPAID,
					value: LeaveType.UNPAID,
				},
			],
		},
	];
};
