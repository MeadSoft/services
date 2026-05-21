import fs from 'fs';
import cookieParser from 'cookie-parser';
import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { HttpConfig } from '@meadsoft/common-http-server-nestjs';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { EMPTY_LENGTH, ERROR_EXIT_CODE } from '@meadsoft/common';

const DEFAULT_PORT = 3000;
const DEFAULT_ALLOWED_ORIGINS = [
    'http://localhost:4200',
    'http://localhost:4201',
];

function getAllowedOrigins(): string[] {
    const raw = process.env.CORS_ALLOWED_ORIGINS?.trim();
    if (raw == null) return DEFAULT_ALLOWED_ORIGINS;

    return raw
        .split(',')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > EMPTY_LENGTH);
}

function originMatches(allowedOriginPattern: string, origin: string): boolean {
    if (!allowedOriginPattern.includes('*')) {
        return allowedOriginPattern === origin;
    }

    const escapedPattern = allowedOriginPattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');

    return new RegExp(`^${escapedPattern}$`).test(origin);
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        snapshot: true,
        abortOnError: false,
        logger: ['error', 'warn', 'log', 'debug'],
    });

    // app.get(DebugService).listRoutes(app).forEach((route) => {
    //     console.log(`Route: ${route}`);
    // });

    const allowedOrigins = getAllowedOrigins();

    app.enableCors({
        origin: (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean) => void,
        ) => {
            // Non-browser clients or same-origin requests may omit the Origin header.
            if (origin == null) {
                callback(null, true);
                return;
            }

            const isAllowed = allowedOrigins.some((allowedPattern) =>
                originMatches(allowedPattern, origin),
            );

            if (isAllowed) {
                callback(null, true);
                return;
            }

            callback(new Error(`CORS origin not allowed: ${origin}`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    app.use(cookieParser());

    app.setGlobalPrefix('api');

    setupSwagger(app, 'swagger');
    const httpConfig = app.get(HttpConfig);
    console.log('http config port', httpConfig.port);
    await app.listen(httpConfig.port || DEFAULT_PORT);
}

bootstrap().catch((error: unknown) => {
    console.error('Bootstrap error:', error);
    const partialGraph = PartialGraphHost.toString();
    if (partialGraph !== undefined) {
        fs.writeFileSync('graph.json', partialGraph);
    }
    process.exit(ERROR_EXIT_CODE);
});
