import { MiddlewareConsumer, Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
// import { FirebaseModule } from '@meadsoft/google';
// import { FilesModule } from '@meadsoft/files';
import { HttpModule } from './http.module';
// import { DebugModule } from '@meadsoft/debug';
// import { AuthModule } from '@meadsoft/auth';
// import { DevtoolsModule } from '@nestjs/devtools-integration';
import { RestaurantCatalogModule } from '@meadsoft/restaurant-catalog-server-nestjs';
import { RequestLoggerMiddleware } from '@meadsoft/common-nestjs';
// import { HaruCafeDrizzlePgModule } from '@meadsoft/restaurant-catalog-server-nestjs';

@Module({
    imports: [
        // DevtoolsModule.register({
        //     http: process.env.NODE_ENV !== 'production',
        // }),
        // DebugModule,
        HttpModule,
        // HaruCafeDrizzlePgModule,
        RestaurantCatalogModule,
        // FilesModule,
        // FirebaseModule,
        // AuthModule,
        // PassportModule.register({ defaultStrategy: 'google' }),
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}
