import { MiddlewareConsumer, Module } from '@nestjs/common';
import { IamModule } from '@meadsoft/iam-http-server-nestjs';
import { HttpConfigProvider } from '@meadsoft/common-http-server-nestjs';
import { RequestLoggerMiddleware } from '@meadsoft/common-nestjs';
import { ConfigPathProvider } from './config-path.provider';

@Module({
    providers: [ConfigPathProvider, HttpConfigProvider],
    imports: [IamModule],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}
