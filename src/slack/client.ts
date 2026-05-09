import bolt from '@slack/bolt';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { EVENT_KEYS } from '../constants/eventKeys';
import { handleEmployeeLeaveCancel } from './handlers/handleEmployeeLeaveCancel';
import { handleEmployeeLeaveSend } from './handlers/handleEmployeeLeaveSend';
import { handleEmployeeMessage } from './handlers/handleEmployeeMessage';
import { handleEmployeeSelectLeaveType } from './handlers/handleEmployeeSelectLeaveType';
import { handleHRLeaveApprove } from './handlers/handleHRLeaveApprove';
import { handleHRLeaveReject } from './handlers/handleHRLeaveReject';
import { handleInfoCommand } from './handlers/handleInfoCommand';
import { handleInfoEmployee } from './handlers/handleInfoEmployee';
import { handleInfoHRPendingRequests } from './handlers/handleInfoHRPendingRequests';
import { handleInfoHRReportGeneral } from './handlers/handleInfoHRReportGeneral';
import { handleInfoHRReportRequests } from './handlers/handleInfoHRReportRequests';
import { handleInfoHRSelectLeaveType } from './handlers/handleInfoHRSelectLeaveType';
import { handleInfoHRUpcomingRequests } from './handlers/handleInfoHRUpcomingRequests';

const { App } = bolt;

export const app = new App({
	token: config.botToken,
	appToken: config.appToken,
	socketMode: true,
});

export async function start() {
	try {
		app.event('message', handleEmployeeMessage);

		app.action(EVENT_KEYS.LEAVE_REQUEST_SEND, handleEmployeeLeaveSend);
		app.action(EVENT_KEYS.LEAVE_REQUEST_CANCEL, handleEmployeeLeaveCancel);

		app.action(EVENT_KEYS.LEAVE_REQUEST_APPROVE, handleHRLeaveApprove);
		app.action(EVENT_KEYS.LEAVE_REQUEST_REJECT, handleHRLeaveReject);

		app.action(EVENT_KEYS.SELECT_LEAVE_TYPE, handleEmployeeSelectLeaveType);

		app.command('/info', handleInfoCommand);

		app.action(
			new RegExp(`^${EVENT_KEYS.INFO_EMPLOYEE_REQUESTS}`, 'g'),
			handleInfoEmployee,
		);

		app.action(
			EVENT_KEYS.INFO_HR_SELECT_LEAVE_TYPE,
			handleInfoHRSelectLeaveType,
		);

		app.action(
			EVENT_KEYS.INFO_HR_UPCOMING_REQUESTS,
			handleInfoHRUpcomingRequests,
		);
		app.action(
			EVENT_KEYS.INFO_HR_PENDING_REQUESTS,
			handleInfoHRPendingRequests,
		);

		app.action(EVENT_KEYS.INFO_HR_REPORT_REQUESTS, handleInfoHRReportRequests);

		app.action(
			new RegExp(`^${EVENT_KEYS.INFO_HR_REPORT_GENERAL}`, 'g'),
			handleInfoHRReportGeneral,
		);

		await app.start();

		logger.info('Slack socket started');
	} catch (error) {
		logger.error('Error starting Slack app', { error });
	}
}
