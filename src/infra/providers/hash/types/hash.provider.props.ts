export abstract class HashProvider {
	abstract hash(data: string): Promise<string>;
	abstract compare(data: string, hashed: string): Promise<boolean>;
}
