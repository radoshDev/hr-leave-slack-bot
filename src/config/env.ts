import 'dotenv/config';
import { z } from 'zod';
import { isValidTimeZone } from '../utils/timezone';

const EnvSchema = z.object({
	SLACK_APP_TOKEN: z
		.string()
		.min(1, 'required')
		.startsWith('xapp-', 'must start with "xapp-"'),
	SLACK_BOT_TOKEN: z
		.string()
		.min(1, 'required')
		.startsWith('xoxb-', 'must start with "xoxb-"'),
	HR_CHANNEL_ID: z
		.string()
		.min(1, 'required')
		.refine((v) => v.startsWith('C') || v.startsWith('G'), {
			message: 'must start with "C" (public) or "G" (private)',
		}),
	TZ: z
		.string()
		.default('Europe/Kyiv')
		.refine(isValidTimeZone, { message: 'invalid IANA time zone' }),
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

type Env = z.infer<typeof EnvSchema>;

export type Config = Readonly<{
	appToken: string;
	botToken: string;
	hrChannelId: string;
	timezone: string;
	nodeEnv: 'development' | 'production';
	logLevel: 'debug' | 'info' | 'warn' | 'error';
}>;

function parseEnv(): Env {
	const result = EnvSchema.safeParse(process.env);
	if (!result.success) {
		const issues = result.error.issues
			.map((i) => `${i.path.join('.')}: ${i.message}`)
			.join('\n  - ');
		// biome-ignore lint/suspicious/noConsole: this is only for terminal output
		console.error(
			`\n[ENV VALIDATION ERROR]\n  - ${issues}\n` +
				'Fix your .env or environment variables and re-run.\n',
		);
		process.exit(1);
	}
	return result.data;
}

const env = parseEnv();

export const config: Config = Object.freeze({
	appToken: env.SLACK_APP_TOKEN,
	botToken: env.SLACK_BOT_TOKEN,
	hrChannelId: env.HR_CHANNEL_ID,
	timezone: env.TZ,
	nodeEnv: env.NODE_ENV,
	logLevel: env.LOG_LEVEL,
});
