import 'dotenv/config';
import { logsAdapter } from '@common/adapters/api-logs/logs.adapter';
import { z } from 'zod';

const envSchema = z.object({
	MONGO_URI: z.string().min(1, { message: 'A MONGO_URI é obrigatória' }),
	JWT_SECRET: z.string().min(1, { message: 'O JWT_SECRET é obrigatório' }),
	JWT_REFRESH_SECRET: z
		.string()
		.min(1, { message: 'O JWT_REFRESH_SECRET é obrigatório' }),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
	logsAdapter.error(
		'Environment variables',
		JSON.stringify(parsedEnv.error.flatten().fieldErrors),
	);

	process.exit(1);
}

export const env = parsedEnv.data;
