import bolt from '@slack/bolt';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { handleMessage } from './handlers/handleMessage';
import { handleVacationCancel } from './handlers/handleLeaveRequestCancel';
import { handleVacationSend } from './handlers/handleLeaveRequestSend';
import { EVENT_KEYS } from '../constants/eventKeys';

const { App } = bolt;

export const app = new App({
	token: config.botToken,
	appToken: config.appToken,
	socketMode: true,
});

export async function start() {
	app.event('message', handleMessage);

	app.action(EVENT_KEYS.LEAVE_REQUEST_SEND, handleVacationSend);
	app.action(EVENT_KEYS.LEAVE_REQUEST_CANCEL, handleVacationCancel);

	await app.start();

	logger.info('Slack socket started');
}
