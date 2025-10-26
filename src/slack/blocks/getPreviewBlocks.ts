import type { Block, KnownBlock } from '@slack/types';
import { formatDate } from '../../utils/formatDate';
import type { ParsedVacation } from '../../types/vacation';

type GetPreviewBlocks = (
	args: ParsedVacation & { userId: string },
) => (KnownBlock | Block)[];

export const getPreviewBlocks: GetPreviewBlocks = ({
	userId,
	start,
	end,
	days,
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
			text: `📅 *Range*: ${formatDate(start)} — ${formatDate(end)}`,
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
					start: start.toISOString(),
					end: end.toISOString(),
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
