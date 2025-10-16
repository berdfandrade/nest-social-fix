import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('env config', () => {
	const ORIGINAL_ENV = process.env;
	let mockExit: ReturnType<typeof vi.spyOn>;
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.resetModules();
		process.env = { ...ORIGINAL_ENV };

		mockExit = vi.spyOn(process, 'exit').mockImplementation(((
			code?: number,
		) => {
			throw new Error(`process.exit: ${code}`);
		}) as never);

		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		process.env = ORIGINAL_ENV;
	});

	it('deve carregar o env com sucesso quando MONGO_URI está definida', async () => {
		process.env.MONGO_URI = 'mongodb://localhost:27017/test-db';

		const { env } = await import('src/env.js');

		expect(env.MONGO_URI).toBe('mongodb://localhost:27017/test-db');
		expect(mockExit).not.toHaveBeenCalled();
	});

	it('deve chamar process.exit(1) e logar erro quando MONGO_URI está ausente', async () => {
		delete process.env.MONGO_URI;

		await expect(import('src/env.js')).rejects.toThrow('process.exit: 1');

		expect(consoleErrorSpy).not.toHaveBeenCalled();
		expect(mockExit).toHaveBeenCalledWith(1);
	});
});
