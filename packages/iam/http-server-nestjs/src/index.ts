export { AuthGuard } from './guards/auth.guard';
export { RolesGuard } from './guards/roles.guard';
export { IamModule } from './iam.module';
export {
    IAM_CONFIG_KEY as AUTH_CONFIG_KEY,
    IamConfig as AuthConfig,
} from './iam.config';
export { IamConfigProvider, IamConfigLoader } from './iam-config.provider';
export {
    PrincipleQueryController,
    PrincipleCommandController,
} from './controllers/principle.controller';
export { JwtCookieStrategy as JwtStrategy } from './controllers/http-only-cookie.strategy';
export { CurrentPrinciple } from './controllers/principle.decorator';

// database
export {
    IamDbService as AuthDbService,
    IamUnitOfWork as AuthUnitOfWork,
} from './database/iam-database.service';
export { PrincipleRepository } from './database/repositories/principle.repo';
export { PrincipleLoginMethodRepository } from './database/repositories/principle-login-method.repo';
export { OrganizationalResourcesRepository } from './database/repositories/organizational-resources.repo';
export { RolesRepository } from './database/repositories/roles.repo';
export { PermissionsRepository } from './database/repositories/permissions.repo';
export { PoliciesRepository } from './database/repositories/policies.repo';
export { PolicyBindingsRepository } from './database/repositories/policy-bindings.repo';
export { RolePermissionsRepository } from './database/repositories/role-permissions.repo';
export { iamDrizzlePgSchema as authDrizzleSchema } from './database/tables/drizzle-schema';
export type { IamDrizzlePgSchema as AuthDrizzleSchema } from './database/tables/drizzle-schema';

// services
export { PrincipleService } from './services/principle.service';
export { PrincipleLoginMethodService } from './services/principle-login-method.service';
export {
    OrganizationalResourceQueryService,
    OrganizationalResourceCommandService,
} from './services/organizational-resource.service';
export { RoleQueryService, RoleCommandService } from './services/role.service';
export {
    PermissionQueryService,
    PermissionCommandService,
} from './services/permission.service';
export {
    PolicyQueryService,
    PolicyCommandService,
} from './services/policy.service';
export {
    PolicyBindingQueryService,
    PolicyBindingCommandService,
} from './services/policy-binding.service';

// domain
export * from './domain/index';
