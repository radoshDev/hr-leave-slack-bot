import { logger } from './config/logger';
import { start } from './slack/client';

async function main() {
	try {
		start();
	} catch (error) {
		logger.error('Failed to start app', { error });
	}
}
main();
