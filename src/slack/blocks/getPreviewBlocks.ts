import type { Block, KnownBlock } from '@slack/types';
import type { LeaveRequestInput } from '../../types/leaveRequest';
import { formatDate } from '../../utils/formatDate';
import { LeaveType } from '@prisma/client';
import { EVENT_KEYS } from '../../constants/eventKeys';

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
			text: `📅 *Range*: ${formatDate(startDate)} — ${formatDate(endDate)}`,
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
					start: startDate.toISOString(),
					end: endDate.toISOString(),
					year,
					days,
					type: LeaveType.VACATION,
				}),
			},
			{
				type: 'button',
				text: { type: 'plain_text', text: 'Cancel' },
				style: 'danger',
				action_id: 'vacation_cancel',
				value: JSON.stringify({ userId }),
			},
		],
	},
];
