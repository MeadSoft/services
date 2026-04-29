import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

export function setupSwagger(app: INestApplication, path: string) {
    const config = new DocumentBuilder()
        .setTitle('Restaurant Catalog API')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(path, app, cleanupOpenApiDoc(documentFactory()));
}
