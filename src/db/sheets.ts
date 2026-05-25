import { google } from 'googleapis';
import { logger } from '../config/logger';
import { leaveTypesText } from '../constants/leaveTypeMessages';
import type { LeaveType } from '@prisma/client';
import type { LeaveRequestInput } from '../types/leaveRequest';

const keyFile = process.env.GOOGLE_CREDENTIALS_PATH;
const spreadsheetId = process.env.GOOGLE_SHEET_ID;

if (!keyFile) throw new Error('GOOGLE_CREDENTIALS_PATH is not provided');
if (!spreadsheetId) throw new Error('GOOGLE_SHEET_ID is not provided');

const auth = new google.auth.GoogleAuth({
	keyFile,
	scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

function getSheetRange(leaveType: LeaveType) {
	return `${leaveTypesText[leaveType]}!A1:E1`;
}

export type LeaveRequestSheetData = LeaveRequestInput & {
	fullName: string;
};

export const sheetsApi = {
	append: async ({
		userId,
		fullName,
		type: leaveType,
		startDate,
		endDate,
		days,
	}: LeaveRequestSheetData) => {
		try {
			await sheets.spreadsheets.values.append({
				spreadsheetId,
				valueInputOption: 'RAW',
				range: getSheetRange(leaveType),
				requestBody: {
					majorDimension: 'ROWS',
					values: [[userId, fullName, startDate, endDate, days]],
				},
			});
		} catch (error) {
			logger.error('Failed to save in spreadsheet', { error });
		}
	},
};
