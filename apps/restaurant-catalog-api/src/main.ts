import cookieParser from 'cookie-parser';
import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { HttpConfig } from './http.config';
import { AppModule } from './app.module';
import fs from 'fs';
import { setupSwagger } from './swagger';
// import { DebugService } from '@meadsoft/debug';

const DEFAULT_PORT = 3000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        snapshot: true,
        abortOnError: false,
        logger: ['error', 'warn', 'log', 'debug'],
    });

    // app.get(DebugService).listRoutes(app).forEach((route) => {
    //     console.log(`Route: ${route}`);
    // });

    app.enableCors({
        origin: ['http://localhost:4200', 'http://localhost:4201'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    app.use(cookieParser());

    app.setGlobalPrefix('api');

    setupSwagger(app, 'swagger');
    const httpConfig = app.get(HttpConfig);
    await app.listen(httpConfig.port || DEFAULT_PORT);
}
bootstrap().catch(() => {
    fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
    process.exit(1);
});
