export { AuthGuard } from './guards/auth.guard';
export { RolesGuard } from './guards/roles.guard';
export { AuthModule } from './iam.module';
export {
    IAM_CONFIG_KEY as AUTH_CONFIG_KEY,
    IamConfig as AuthConfig,
} from './iam.config';
export {
    IamConfigProvider as AuthConfigProvider,
    IamConfigLoader as AuthConfigLoader,
} from './iam-config.provider';
export { PrincipleController as AuthController } from './controllers/principle.controller';
export { JwtCookieStrategy as JwtStrategy } from './controllers/http-only-cookie.strategy';
export { CurrentPrinciple } from './controllers/principle.decorator';

// database
export {
    AuthDbService,
    AuthUnitOfWork,
} from './database/repositories/iam-database.service';
export {
    PrincipleRepository,
    PrincipleLoginMethodRepository,
} from './database/repositories/principle.repo';
export { authDrizzleSchema } from './database/tables/drizzle-schema';
export type { AuthDrizzleSchema } from './database/tables/drizzle-schema';

// services
export { PrincipleService } from './services/principle.service';
