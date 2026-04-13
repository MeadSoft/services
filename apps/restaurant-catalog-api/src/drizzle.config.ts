import { InfrastructureConfigLoader } from '@meadsoft/common-infrastructure';
import { defineConfig } from 'drizzle-kit';

const configLoader = new InfrastructureConfigLoader();
const config = configLoader.loadSync();

if (config.err) {
    throw config.val;
}

export default defineConfig({
    out: `src/migrations/${config.val.APP_ENV}`,
    schema: [
        'node_modules/@meadsoft/restaurant-catalog-server-nestjs/src/database/tables',
        'node_modules/@meadsoft/auth-server-nestjs/src/database/tables',
    ],
    dialect: 'postgresql',
    dbCredentials: {
        url: config.val.DATABASE_URL,
    },
});
