import { logger } from '../../config/logger';
import { prisma } from '../../db/prisma';
import { getReportCSV } from '../helpers/getReportCSV';
import type { ActionMiddleware } from '../../types/handler';

export const handleInfoHRReportGeneral: ActionMiddleware = async ({
	ack,
	body,
	client,
	action,
}) => {
	try {
		await ack();

		const channelId = body.channel?.id;
		const year = Number(action.value);

		if (!channelId) throw new Error('Channel ID missing');
		if (!year) throw new Error('Year not provided');

		const requests = await prisma.leaveRequest.findMany({
			where: { year, status: 'APPROVED' },
			orderBy: [{ type: 'asc' }, { startDate: 'asc' }],
			include: { user: true },
		});

		if (requests.length === 0) {
			await client.chat.postMessage({
				channel: channelId,
				text: 'No data available for report.',
			});
			return;
		}

		await client.files.uploadV2({
			channel_id: channelId,
			filename: `general-report-${year}.csv`,
			title: `General Report ${year}`,
			content: getReportCSV(requests),
		});

		await client.chat.postMessage({
			channel: channelId,
			text: `📊 General report for *${year}* has been uploaded.`,
		});
	} catch (error) {
		logger.error('Error in handleInfoHRReportRequests:', error);
	}
};
