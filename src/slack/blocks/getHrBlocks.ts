import type { Block, KnownBlock } from '@slack/types';
import { EVENT_KEYS } from '../../constants/eventKeys';
import type { LeaveRequestInput } from '../../types/leaveRequest';
import { formatDate } from '../../utils/formatDate';

type GetHrBlocks = (
	input: LeaveRequestInput,
	requestId: number,
) => (KnownBlock | Block)[];

export const getHrBlocks: GetHrBlocks = (
	{ userId, startDate, endDate, days, type: leaveType },
	requestId,
) => [
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
				text: `${formatDate(new Date(startDate), 'dd.MM.yyyy')} — ${formatDate(new Date(endDate), 'dd.MM.yyyy')}`,
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
			{ type: 'mrkdwn', text: '🗓 *Leave Type*' },
			{ type: 'mrkdwn', text: `${leaveType}` },
		],
	},
	{ type: 'divider' },
	{
		type: 'actions',
		elements: [
			{
				type: 'button',
				text: { type: 'plain_text', text: 'Approve' },
				style: 'primary',
				action_id: EVENT_KEYS.LEAVE_REQUEST_APPROVE,
				value: requestId.toString(),
			},
			{
				type: 'button',
				text: { type: 'plain_text', text: 'Reject' },
				style: 'danger',
				action_id: EVENT_KEYS.LEAVE_REQUEST_REJECT,
				value: requestId.toString(),
			},
		],
	},
];
