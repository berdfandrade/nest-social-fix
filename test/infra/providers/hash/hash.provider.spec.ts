import { HashProviderImplementation } from 'src/infra/providers/hash/hash.provider';
import { beforeAll, describe, expect, it } from 'vitest';

let hashProvider: HashProviderImplementation;

beforeAll(() => {
	hashProvider = new HashProviderImplementation();
});

describe('HashProviderImplementation', () => {
	it('should hash a string successfully', async () => {
		const data = 'my-password';
		const hashed = await hashProvider.hash(data);

		expect(typeof hashed).toBe('string');
		expect(hashed).not.toBe(data); // hash deve ser diferente do original
	});

	it('should compare string with hash successfully (true)', async () => {
		const data = 'my-password';
		const hashed = await hashProvider.hash(data);

		const result = await hashProvider.compare(data, hashed);
		expect(result).toBe(true);
	});

	it('should compare string with hash successfully (false)', async () => {
		const data = 'my-password';
		const wrongHash = await hashProvider.hash('wrong-password');

		const result = await hashProvider.compare(data, wrongHash);
		expect(result).toBe(false);
	});
});
