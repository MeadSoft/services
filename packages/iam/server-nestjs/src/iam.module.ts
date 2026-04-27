import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtCookieStrategy } from './controllers/http-only-cookie.strategy';
import { FirebaseModule } from '@meadsoft/google';
import { PrincipleController } from './controllers/principle.controller';
import { IamConfigProvider } from './iam-config.provider';
import {
    DrizzlePgModule,
    PostgresUnitOfWork,
    UnitOfWorkService,
} from '@meadsoft/common-infrastructure';
import { IamDbService, IamUnitOfWork } from './database/iam-database.service';
import {
    PrincipleRepository,
    PrincipleLoginMethodRepository,
} from './database/repositories/principle.repo';
import { PrincipleService } from './services/principle.service';

@Module({
    imports: [
        PassportModule,
        FirebaseModule,
        DrizzlePgModule,
        JwtModule.register({
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [PrincipleController],
    providers: [
        JwtCookieStrategy,
        IamConfigProvider,
        IamDbService,
        IamUnitOfWork,
        { provide: PostgresUnitOfWork, useExisting: IamUnitOfWork },
        { provide: UnitOfWorkService, useExisting: IamUnitOfWork },
        PrincipleRepository,
        PrincipleLoginMethodRepository,
        PrincipleService,
    ],
    exports: [PrincipleService],
})
export class AuthModule {}
