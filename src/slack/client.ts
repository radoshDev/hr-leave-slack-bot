import bolt from '@slack/bolt';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { handleMessage } from './handlers/handleMessage';
import { handleVacationCancel } from './handlers/handleVacationCancel';
import { handleVacationSend } from './handlers/handleVacationSend';

const { App } = bolt;

export const app = new App({
	token: config.botToken,
	appToken: config.appToken,
	socketMode: true,
});

export async function start() {
	app.event('message', handleMessage);

	app.action('vacation_send', handleVacationSend);
	app.action('vacation_cancel', handleVacationCancel);

	await app.start();

	logger.info('Slack socket started');
}
