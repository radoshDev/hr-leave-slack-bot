import bolt from '@slack/bolt';
import { config } from '../config/env';
import { logger } from '../config/logger';

const { App } = bolt;

export const app = new App({
	token: config.botToken,
	appToken: config.appToken,
	socketMode: true,
});

export async function start() {
	await app.start();
	logger.info('Slack socket started');
}
