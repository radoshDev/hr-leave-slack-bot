import type { Block, KnownBlock } from '@slack/types';
import type { ParsedVacationWithUser } from '../../types/vacation';
import { formatDate } from '../../utils/formatDate';

type GetHrBlocks = (args: ParsedVacationWithUser) => (KnownBlock | Block)[];

export const getHrBlocks: GetHrBlocks = ({
	userId,
	startDate,
	endDate,
	days,
}) => [
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
			{
				type: 'mrkdwn',
				text: `${formatDate(startDate)} — ${formatDate(endDate)}`,
			},
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
