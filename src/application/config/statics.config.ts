import { join } from 'node:path';
import { INestApplication } from '@nestjs/common';
import express from 'express';

export function staticsConfig(app: INestApplication) {
	// Caminho absoluto da pasta public
	const publicPath = join(process.cwd(), 'public');
	app.use('/public', express.static(publicPath));
}
