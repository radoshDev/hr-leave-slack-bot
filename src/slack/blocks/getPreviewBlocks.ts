import type { Block, KnownBlock } from '@slack/types';
import type { ParsedVacationWithUser } from '../../types/vacation';
import { formatDate } from '../../utils/formatDate';

type GetPreviewBlocks = (
	args: ParsedVacationWithUser,
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
				action_id: 'vacation_send',
				value: JSON.stringify({
					userId,
					start: startDate.toISOString(),
					end: endDate.toISOString(),
					year,
					days,
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
