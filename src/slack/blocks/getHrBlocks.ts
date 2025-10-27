import type { Block, KnownBlock } from '@slack/types';
import type { LeaveRequestInput } from '../../types/leaveRequest';
import { formatDate } from '../../utils/formatDate';

type GetHrBlocks = (input: LeaveRequestInput) => (KnownBlock | Block)[];

export const getHrBlocks: GetHrBlocks = ({
	userId,
	startDate,
	endDate,
	days,
	type: leaveType,
}) => [
	{ type: 'header', text: { type: 'plain_text', text: 'Leave request' } },
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
	{
		type: 'section',
		fields: [
			{ type: 'mrkdwn', text: '⏳ *Leave Type*' },
			{ type: 'mrkdwn', text: `${leaveType}` },
		],
	},
	{ type: 'divider' },
];
