import { Global, Module } from '@nestjs/common';
import { ConfigPathProvider } from './config';

@Global()
@Module({
    providers: [ConfigPathProvider],
    exports: [ConfigPathProvider],
})
export class ConfigModule {}
