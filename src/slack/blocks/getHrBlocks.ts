import { EVENT_KEYS } from '../../constants/eventKeys';
import { leaveTypesText } from '../../constants/leaveTypeMessages';
import { formatDate } from '../../utils/formatDate';
import type { LeaveRequest } from '@prisma/client';
import type { Blocks } from '../../types/handler';

type GetHrBlocks = ({ requestData }: { requestData: LeaveRequest }) => Blocks;

export const getHrBlocks: GetHrBlocks = ({ requestData }) => {
	const {
		userId,
		startDate,
		endDate,
		days,
		type: leaveType,
		id: requestId,
	} = requestData;
	return [
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
				{ type: 'mrkdwn', text: `${leaveTypesText[leaveType]}` },
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
};
