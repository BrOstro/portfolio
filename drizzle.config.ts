import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './lib/schema.ts',
	out: './migrations',
	dialect: 'postgresql',
	dbCredentials: { url: process.env.DATABASE_URL! },
	verbose: process.env.NODE_ENV !== 'production',
	strict: true,
});
