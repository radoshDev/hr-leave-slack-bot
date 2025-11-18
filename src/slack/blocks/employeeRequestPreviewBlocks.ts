import { LeaveType } from '@prisma/client';
import { EMOJI } from '../../constants/emoji';
import { EVENT_KEYS } from '../../constants/eventKeys';
import { leaveTypesText } from '../../constants/leaveTypeMessages';
import { formatDate } from '../../utils/formatDate';
import type { Block, KnownBlock } from '@slack/types';
import type { LeaveRequestInput } from '../../types/leaveRequest';

type GetPreviewBlocks = (
	args: Omit<LeaveRequestInput, 'type'>,
) => (KnownBlock | Block)[];

export const employeeRequestPreviewBlocks: GetPreviewBlocks = ({
	userId,
	startDate,
	endDate,
	days,
	year,
}) => [
	{
		type: 'header',
		text: { type: 'plain_text', text: 'Leave request (preview)' },
	},
	{ type: 'divider' },
	{
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `${EMOJI.employee} *Employee*: <@${userId}>`,
		},
	},
	{
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `${EMOJI.period} *Period*: ${formatDate(new Date(startDate), 'dd.MM.yyyy')} — ${formatDate(new Date(endDate), 'dd.MM.yyyy')}`,
		},
	},
	{
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `${EMOJI.days} *Days*: ${days}`,
		},
	},
	{
		type: 'section',
		text: { type: 'mrkdwn', text: '*Select leave type:*' },
		accessory: {
			type: 'static_select',
			action_id: EVENT_KEYS.SELECT_LEAVE_TYPE,
			placeholder: {
				type: 'plain_text',
				text: `${EMOJI.VACATION} ${leaveTypesText.VACATION}`,
			},
			options: [LeaveType.VACATION, LeaveType.SICK_LEAVE].map((leaveType) => ({
				text: {
					type: 'plain_text',
					text: `${EMOJI[leaveType]} ${leaveTypesText[leaveType]}`,
				},
				value: LeaveType[leaveType],
			})),
		},
	},
	{ type: 'divider' },
	{
		type: 'actions',
		elements: [
			{
				type: 'button',
				text: { type: 'plain_text', text: 'Send' },
				style: 'primary',
				action_id: EVENT_KEYS.LEAVE_REQUEST_SEND,
				value: JSON.stringify({
					userId,
					startDate,
					endDate,
					year,
					days,
				} satisfies Omit<LeaveRequestInput, 'type'>),
			},
			{
				type: 'button',
				text: { type: 'plain_text', text: 'Cancel' },
				style: 'danger',
				action_id: EVENT_KEYS.LEAVE_REQUEST_CANCEL,
				value: JSON.stringify({ userId }),
			},
		],
	},
];
