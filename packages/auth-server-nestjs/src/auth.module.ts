import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { FirebaseModule } from '@meadsoft/google';
import { AuthController } from './auth.controller';
import { AuthConfigProvider } from './auth.config';
import {
    DrizzlePgModule,
    PostgresUnitOfWork,
    UnitOfWorkService,
} from '@meadsoft/common-infrastructure';
import {
    AuthDbService,
    AuthUnitOfWork,
} from './database/repositories/auth-database.service';
import {
    UserAccountRepository,
    UserLoginMethodRepository,
} from './database/repositories/user-account.repo';
import { UserAccountService } from './services/user-account.service';

@Module({
    imports: [
        PassportModule,
        FirebaseModule,
        DrizzlePgModule,
        JwtModule.register({
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        JwtStrategy,
        AuthConfigProvider,
        AuthDbService,
        AuthUnitOfWork,
        { provide: PostgresUnitOfWork, useExisting: AuthUnitOfWork },
        { provide: UnitOfWorkService, useExisting: AuthUnitOfWork },
        UserAccountRepository,
        UserLoginMethodRepository,
        UserAccountService,
    ],
    exports: [UserAccountService],
})
export class AuthModule {}
