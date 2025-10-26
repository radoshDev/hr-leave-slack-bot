import type { Block, KnownBlock } from '@slack/types';
import { formatDate } from '../../utils/formatDate';
import type { ParsedVacation } from '../../types/vacation';

type GetHrBlocks = (
	args: ParsedVacation & { userId: string },
) => (KnownBlock | Block)[];

export const getHrBlocks: GetHrBlocks = ({ userId, start, end, days }) => [
	{ type: 'header', text: { type: 'plain_text', text: 'Vacation request' } },
	{ type: 'divider' },
	{
		type: 'section',
		fields: [
			{ type: 'mrkdwn', text: '👤 *Employee*' },
			{ type: 'mrkdwn', text: `<@${userId}>` },
		],
	},
	{
		type: 'section',
		fields: [
			{ type: 'mrkdwn', text: '📅 *Range*' },
			{ type: 'mrkdwn', text: `${formatDate(start)} — ${formatDate(end)}` },
		],
	},
	{
		type: 'section',
		fields: [
			{ type: 'mrkdwn', text: '⏳ *Days*' },
			{ type: 'mrkdwn', text: `${days}` },
		],
	},
	{ type: 'divider' },
];
