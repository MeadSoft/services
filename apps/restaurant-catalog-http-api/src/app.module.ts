import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RestaurantCatalogModule } from '@meadsoft/restaurant-catalog-http-server-nestjs';
import { RequestLoggerMiddleware } from '@meadsoft/common-nestjs';
import { ConfigPathProvider } from './config-path.provider';
import { HttpConfigProvider } from '@meadsoft/common-http-server-nestjs';

@Module({
    providers: [ConfigPathProvider, HttpConfigProvider],
    imports: [RestaurantCatalogModule],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}
