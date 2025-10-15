import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashProvider } from './types/hash.provider.props';

@Injectable()
export class HashProviderImplementation implements HashProvider {
	private readonly saltRounds = 10;

	async hash(data: string): Promise<string> {
		return bcrypt.hash(data, this.saltRounds);
	}

	async compare(data: string, hashed: string): Promise<boolean> {
		return bcrypt.compare(data, hashed);
	}
}
