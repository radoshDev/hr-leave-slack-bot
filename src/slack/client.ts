import bolt from '@slack/bolt';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { EVENT_KEYS } from '../constants/eventKeys';
import { handleInfoCommand } from './handlers/handleInfoCommand';
import { handleInfoEmployeeLeaveRequest } from './handlers/handleInfoEmployeeLeaveRequest';
import { handleLeaveApprove } from './handlers/handleLeaveApprove';
import { handleLeaveReject } from './handlers/handleLeaveReject';
import { handleLeaveRequestCancel } from './handlers/handleLeaveRequestCancel';
import { handleLeaveRequestSend } from './handlers/handleLeaveRequestSend';
import { handleMessage } from './handlers/handleMessage';
import { handleSelectLeaveType } from './handlers/handleSelectLeaveType';

const { App } = bolt;

export const app = new App({
	token: config.botToken,
	appToken: config.appToken,
	socketMode: true,
});

export async function start() {
	try {
		app.event('message', handleMessage);

		app.action(EVENT_KEYS.LEAVE_REQUEST_SEND, handleLeaveRequestSend);
		app.action(EVENT_KEYS.LEAVE_REQUEST_CANCEL, handleLeaveRequestCancel);

		app.action(EVENT_KEYS.LEAVE_REQUEST_APPROVE, handleLeaveApprove);
		app.action(EVENT_KEYS.LEAVE_REQUEST_REJECT, handleLeaveReject);

		app.action(EVENT_KEYS.SELECT_LEAVE_TYPE, handleSelectLeaveType);

		app.command('/info', handleInfoCommand);

		app.action(
			EVENT_KEYS.INFO_EMPLOYEE_VACATION,
			handleInfoEmployeeLeaveRequest,
		);
		app.action(EVENT_KEYS.INFO_EMPLOYEE_SICK, handleInfoEmployeeLeaveRequest);
		app.action(EVENT_KEYS.INFO_EMPLOYEE_UNPAID, handleInfoEmployeeLeaveRequest);

		await app.start();

		logger.info('Slack socket started');
	} catch (error) {
		logger.error('Error starting Slack app', { error });
	}
}
