import bolt from '@slack/bolt';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { EVENT_KEYS } from '../constants/eventKeys';
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
	app.event('message', handleMessage);

	app.action(EVENT_KEYS.LEAVE_REQUEST_SEND, handleLeaveRequestSend);
	app.action(EVENT_KEYS.LEAVE_REQUEST_CANCEL, handleLeaveRequestCancel);

	app.action(EVENT_KEYS.LEAVE_REQUEST_APPROVE, handleLeaveApprove);
	app.action(EVENT_KEYS.LEAVE_REQUEST_REJECT, handleLeaveReject);

	app.action(EVENT_KEYS.SELECT_LEAVE_TYPE, handleSelectLeaveType);

	await app.start();

	logger.info('Slack socket started');
}
