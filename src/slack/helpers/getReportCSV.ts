import { formatDate } from '../../utils/formatDate';
import type { LeaveRequest, UserProfile } from '@prisma/client';

type RequestWithUser = LeaveRequest & { user: UserProfile };

export const getReportCSV = (requests: RequestWithUser[]): string => {
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

	return buffer.toString();
};
