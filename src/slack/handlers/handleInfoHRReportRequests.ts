import { logger } from '../../config/logger';
import { EMOJI } from '../../constants/emoji';
import { leaveTypesText } from '../../constants/leaveTypeMessages';
import { prisma } from '../../db/prisma';
import { formatDate } from '../../utils/formatDate';
import type { LeaveType } from '@prisma/client';
import type { ActionMiddleware } from '../../types/handler';

export const handleInfoHRReportRequests: ActionMiddleware = async ({
	ack,
	action,
	body,
	client,
}) => {
	try {
		await ack();

		const leaveType = action.value as LeaveType | undefined;
		const channelId = body.channel?.id;

		if (!leaveType) throw new Error('Leave type not provided');
		if (!channelId) throw new Error('Channel ID missing');

		const year = new Date().getFullYear();

		const requests = await prisma.leaveRequest.findMany({
			where: { year, type: leaveType },
			orderBy: { startDate: 'asc' },
			include: { user: true },
		});

		if (requests.length === 0) {
			await client.chat.postMessage({
				channel: channelId,
				text: 'No data available for report.',
			});
			return;
		}

		const rows = [
			['Employee', 'Start Date', 'End Date', 'Days', 'Type', 'Status'], // header
			...requests.map((r) => [
				r.user.fullName,
				formatDate(r.startDate, 'dd.MM.yyyy'),
				formatDate(r.endDate, 'dd.MM.yyyy'),
				String(r.days),
				r.type,
				r.status,
			]),
		];

		const csv = rows.map((row) => row.join(',')).join('\n');
		const buffer = Buffer.from(csv, 'utf8');

		await client.files.uploadV2({
			channel_id: channelId,
			filename: `report-${leaveType}-${year}.csv`,
			title: `${leaveTypesText[leaveType]} Report ${year}`,
			content: buffer.toString(),
		});

		await client.chat.postMessage({
			channel: channelId,
			text: `📊 CSV report for ${EMOJI[leaveType]} *${leaveTypesText[leaveType]}* has been uploaded.`,
		});
	} catch (error) {
		logger.error('Error in handleInfoHRReportRequests:', error);
	}
};
