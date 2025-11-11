import type { Blocks } from '../../types/handler';

export const getHRInfoBlocks = (): Blocks => {
	return [
		{
			type: 'header',
			text: { type: 'plain_text', text: 'Dashboard' },
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: 'Select an option to view leave requests:',
			},
		},
		{
			type: 'actions',
			elements: [
				{
					type: 'button',
					text: { type: 'plain_text', text: '📋 All Requests' },
					action_id: 'hr_all_requests',
				},
				{
					type: 'button',
					text: { type: 'plain_text', text: '🕓 Pending Approvals' },
					action_id: 'hr_pending_requests',
				},
				{
					type: 'button',
					text: { type: 'plain_text', text: '✅ Approved' },
					action_id: 'hr_approved_requests',
				},
				{
					type: 'button',
					text: { type: 'plain_text', text: '❌ Rejected' },
					action_id: 'hr_rejected_requests',
				},
			],
		},
	];
};
