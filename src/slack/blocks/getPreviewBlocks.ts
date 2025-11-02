import { LeaveType } from '@prisma/client';
import { EVENT_KEYS } from '../../constants/eventKeys';
import { formatDate } from '../../utils/formatDate';
import type { Block, KnownBlock } from '@slack/types';
import type { LeaveRequestInput } from '../../types/leaveRequest';

type GetPreviewBlocks = (
	args: Omit<LeaveRequestInput, 'type'>,
) => (KnownBlock | Block)[];

export const getPreviewBlocks: GetPreviewBlocks = ({
	userId,
	startDate,
	endDate,
	days,
	year,
}) => [
	{ type: 'divider' },
	{
		type: 'header',
		text: { type: 'plain_text', text: 'Vacation request (preview)' },
	},
	{ type: 'divider' },
	{
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `👤 *Employee*: <@${userId}>`,
		},
	},
	{
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `📅 *Range*: ${formatDate(new Date(startDate), 'dd.MM.yyyy')} — ${formatDate(new Date(endDate), 'dd.MM.yyyy')}`,
		},
	},
	{
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `⏳ *Days*: ${days}`,
		},
	},
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
					type: LeaveType.VACATION, //TODO: make dynamic when other types are added
				} as LeaveRequestInput),
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
