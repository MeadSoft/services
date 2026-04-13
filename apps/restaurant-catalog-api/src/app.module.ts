import { MiddlewareConsumer, Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
// import { FilesModule } from '@meadsoft/files';
import { HttpModule } from './http.module';
// import { DebugModule } from '@meadsoft/debug';
import { AuthModule } from '@meadsoft/auth-server-nestjs';
// import { DevtoolsModule } from '@nestjs/devtools-integration';
import { RestaurantCatalogModule } from '@meadsoft/restaurant-catalog-server-nestjs';
import { RequestLoggerMiddleware } from '@meadsoft/common-nestjs';
import { ConfigModule } from './config.module';
import { HttpConfigProvider } from './http.config';
import { ChatModule } from './chat/chat.module';
// import { HaruCafeDrizzlePgModule } from '@meadsoft/restaurant-catalog-server-nestjs';

@Module({
    providers: [HttpConfigProvider],
    imports: [
        // DevtoolsModule.register({
        //     http: process.env.NODE_ENV !== 'production',
        // }),
        // DebugModule,
        ConfigModule,
        HttpModule,
        // HaruCafeDrizzlePgModule,
        RestaurantCatalogModule,
        AuthModule,
        ChatModule,
        // FilesModule,
        // PassportModule.register({ defaultStrategy: 'google' }),
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}
