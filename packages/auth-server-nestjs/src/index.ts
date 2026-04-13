export { AuthGuard } from './guards/auth.guard';
export { RolesGuard } from './guards/roles.guard';
export { AuthModule } from './auth.module';
export {
    AUTH_CONFIG_KEY,
    AuthConfig,
    AuthConfigProvider,
    AuthConfigLoader,
} from './auth.config';
export { AuthController } from './auth.controller';
export { JwtStrategy } from './jwt.strategy';
export { CurrentUser } from './user.decorator';

// database
export {
    AuthDbService,
    AuthUnitOfWork,
} from './database/repositories/auth-database.service';
export {
    UserAccountRepository,
    UserLoginMethodRepository,
} from './database/repositories/user-account.repo';
export { authDrizzleSchema } from './database/tables/drizzle-schema';
export type { AuthDrizzleSchema } from './database/tables/drizzle-schema';

// services
export { UserAccountService } from './services/user-account.service';

// contracts
export {
    AUTH_COOKIE_NAME,
    DEFAULT_ROLE,
    UserSchema,
    UserAccountSchema,
    UserLoginMethodSchema,
    LocalLoginRequestSchema,
    LocalRegisterRequestSchema,
} from '@meadsoft/auth-contracts';
export type {
    Roles,
    User,
    IUserAccount,
    IUserLoginMethod,
    ILocalLoginRequest,
    ILocalRegisterRequest,
} from '@meadsoft/auth-contracts';
