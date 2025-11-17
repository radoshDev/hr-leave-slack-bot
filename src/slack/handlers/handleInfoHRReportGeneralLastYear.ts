import { logger } from '../../config/logger';
import { prisma } from '../../db/prisma';
import { getReportCSV } from '../helpers/getReportCSV';
import type { ActionMiddleware } from '../../types/handler';

export const handleInfoHRReportGeneralLastYear: ActionMiddleware = async ({
	ack,
	body,
	client,
}) => {
	try {
		await ack();

		const channelId = body.channel?.id;

		if (!channelId) throw new Error('Channel ID missing');

		const lastYear = new Date().getFullYear() - 1;

		const requests = await prisma.leaveRequest.findMany({
			where: { year: lastYear },
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

		await client.files.uploadV2({
			channel_id: channelId,
			filename: `general-report-${lastYear}.csv`,
			title: `General Report ${lastYear}`,
			content: getReportCSV(requests),
		});

		await client.chat.postMessage({
			channel: channelId,
			text: `📊 General report for *${lastYear}* has been uploaded.`,
		});
	} catch (error) {
		logger.error('Error in handleInfoHRReportRequests:', error);
	}
};
