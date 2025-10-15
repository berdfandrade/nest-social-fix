// test/utils/create-mongoose-model.utils.ts
/** biome-ignore-all lint/suspicious/noExplicitAny: <Precisa ser any, por problemas de tipagem> */

import { Model, model } from 'mongoose';

export function createMongooseModel<T>(name: string, schema: any): Model<T> {
	return model<T>(name, schema);
}
