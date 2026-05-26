import { EMOJI } from '../../constants/emoji';
import { EVENT_KEYS } from '../../constants/eventKeys';
import { leaveTypesText } from '../../constants/leaveTypeMessages';
import { formatDate } from '../../utils/formatDate';
import type { LeaveRequest } from '@prisma/client';
import type { Blocks } from '../../types/handler';
import type { OverlappingEmployee } from '../../features/leave/getOverlappingEmployees';

type GetHrBlocks = ({
	requestData,
	overlappingEmployees,
}: {
	requestData: LeaveRequest;
	overlappingEmployees: OverlappingEmployee[];
}) => Blocks;

export const HRPreviewBlocks: GetHrBlocks = ({ requestData, overlappingEmployees }) => {
	const {
		userId,
		startDate,
		endDate,
		days,
		type: leaveType,
		id: requestId,
	} = requestData;
	return [
		{ type: 'divider' },
		{
			type: 'section',
			fields: [
				{ type: 'mrkdwn', text: `${EMOJI.employee} *Employee*` },
				{ type: 'mrkdwn', text: `<@${userId}>` },
			],
		},
		{
			type: 'section',
			fields: [
				{ type: 'mrkdwn', text: `${EMOJI.period} *Period*` },
				{
					type: 'mrkdwn',
					text: `${formatDate(new Date(startDate), 'dd.MM.yyyy')} — ${formatDate(new Date(endDate), 'dd.MM.yyyy')}`,
				},
			],
		},
		{
			type: 'section',
			fields: [
				{ type: 'mrkdwn', text: `${EMOJI.days} *Days*` },
				{ type: 'mrkdwn', text: `${days}` },
			],
		},
		{
			type: 'section',
			fields: [
				{ type: 'mrkdwn', text: `${EMOJI.type} *Leave Type*` },
				{
					type: 'mrkdwn',
					text: `${EMOJI[leaveType]} ${leaveTypesText[leaveType]}`,
				},
			],
		},
		...(overlappingEmployees.length > 0
			? [
					{
						type: 'section',
						fields: [
							{ type: 'mrkdwn', text: '⚠️ *Overlapping with*' },
							{
								type: 'mrkdwn',
								text: overlappingEmployees
									.map(
										({ userId: uid, startDate: s, endDate: e }) =>
											`<@${uid}> ${formatDate(new Date(s), 'dd.MM.yyyy')} — ${formatDate(new Date(e), 'dd.MM.yyyy')}`,
									)
									.join('\n'),
							},
						],
					},
				]
			: []),
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
