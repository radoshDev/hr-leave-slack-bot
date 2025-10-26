import { logger } from './config/logger';
import { start } from './slack/client';
import { registerDmVacationRequest } from './slack/handlers/dmVacationRequest';

async function main() {
	try {
		registerDmVacationRequest();
		start();
	} catch (error) {
		logger.error('Failed to start app', { error });
	}
}
main();
