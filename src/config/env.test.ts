import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const validEnv = {
	SLACK_APP_TOKEN: 'xapp-xxx',
	SLACK_BOT_TOKEN: 'xoxb-xxx',
	HR_CHANNEL_ID: 'C12345678',
	TZ: 'Europe/Kyiv',
	NODE_ENV: 'development',
	LOG_LEVEL: 'info',
};

const loadEnvModule = async () => {
	vi.resetModules();
	return await import('../../src/config/env');
};

const withEnv = (patch: Partial<NodeJS.ProcessEnv> = {}) => {
	const prev = { ...process.env };
	Object.assign(process.env, validEnv, patch);
	return () => {
		process.env = prev;
	};
};

describe('config/env', () => {
	let errorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
			throw new Error(`process.exit:${code ?? 0}`);
		}) as unknown as (code?: string | number | null) => never);
		errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('loads valid config', async () => {
		const restore = withEnv();
		try {
			const { config } = await loadEnvModule();
			expect(config.appToken).toBe(validEnv.SLACK_APP_TOKEN);
			expect(config.botToken).toBe(validEnv.SLACK_BOT_TOKEN);
			expect(config.hrChannelId).toBe(validEnv.HR_CHANNEL_ID);
			expect(config.timezone).toBe(validEnv.TZ);
			expect(config.nodeEnv).toBe('development');
			expect(config.logLevel).toBe('info');
			expect(Object.isFrozen(config)).toBe(true);
		} finally {
			restore();
		}
	});

	it('defaults TZ to Europe/Kyiv when missing', async () => {
		const env = { ...validEnv };
		// @ts-expect-error
		delete env.TZ;
		const restore = withEnv(env);
		try {
			const { config } = await loadEnvModule();
			expect(config.timezone).toBe('Europe/Kyiv');
		} finally {
			restore();
		}
	});

	it('rejects invalid app token prefix', async () => {
		const restore = withEnv({ SLACK_APP_TOKEN: 'bad-app' });
		try {
			await expect(loadEnvModule()).rejects.toThrow(/process\.exit:1/);
			expect(errorSpy).toHaveBeenCalled();
		} finally {
			restore();
		}
	});

	it('rejects invalid bot token prefix', async () => {
		const restore = withEnv({ SLACK_BOT_TOKEN: 'bad-bot' });
		try {
			await expect(loadEnvModule()).rejects.toThrow(/process\.exit:1/);
			expect(errorSpy).toHaveBeenCalled();
		} finally {
			restore();
		}
	});

	it('rejects invalid channel id prefix', async () => {
		const restore = withEnv({ HR_CHANNEL_ID: 'X123' });
		try {
			await expect(loadEnvModule()).rejects.toThrow(/process\.exit:1/);
			expect(errorSpy).toHaveBeenCalled();
		} finally {
			restore();
		}
	});

	it('rejects invalid timezone', async () => {
		const restore = withEnv({ TZ: 'Not/AZone' });
		try {
			await expect(loadEnvModule()).rejects.toThrow(/process\.exit:1/);
			expect(errorSpy).toHaveBeenCalled();
		} finally {
			restore();
		}
	});

	it('applies default NODE_ENV and LOG_LEVEL', async () => {
		const env = { ...validEnv };
		// @ts-expect-error
		delete env.NODE_ENV;
		// @ts-expect-error
		delete env.LOG_LEVEL;
		const restore = withEnv(env);
		try {
			const { config } = await loadEnvModule();
			expect(config.nodeEnv).toBe('development');
			expect(config.logLevel).toBe('info');
		} finally {
			restore();
		}
	});
});
