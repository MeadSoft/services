import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RestaurantCatalogModule } from '@meadsoft/restaurant-catalog-http-server-nestjs';
import { RequestLoggerMiddleware } from '@meadsoft/common-nestjs';
import { ConfigPathProvider } from './config-path.provider';

@Module({
    providers: [ConfigPathProvider],
    imports: [RestaurantCatalogModule],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}
