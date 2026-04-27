import { Module } from '@nestjs/common';
import {
    DrizzlePgModule,
    PostgresUnitOfWork,
    UnitOfWorkService,
} from '@meadsoft/common-infrastructure';
import { CommonModule } from '@meadsoft/common-nestjs';
import { IamDbService, IamUnitOfWork } from './database/iam-database.service';
import { OrganizationalResourcesRepository } from './database/repositories/organizational-resources.repo';
import { RolesRepository } from './database/repositories/roles.repo';
import { PermissionsRepository } from './database/repositories/permissions.repo';
import { PoliciesRepository } from './database/repositories/policies.repo';
import { PolicyBindingsRepository } from './database/repositories/policy-bindings.repo';
import { RolePermissionsRepository } from './database/repositories/role-permissions.repo';
import {
    OrganizationalResourceQueryService,
    OrganizationalResourceCommandService,
} from './services/organizational-resource.service';
import { RoleQueryService, RoleCommandService } from './services/role.service';
import {
    PermissionQueryService,
    PermissionCommandService,
} from './services/permission.service';
import {
    PolicyQueryService,
    PolicyCommandService,
} from './services/policy.service';
import {
    PolicyBindingQueryService,
    PolicyBindingCommandService,
} from './services/policy-binding.service';
import {
    OrganizationalResourcesQueryController,
    OrganizationalResourcesCommandController,
} from './controllers/organizational-resources.controller';
import {
    RolesQueryController,
    RolesCommandController,
} from './controllers/roles.controller';
import {
    PermissionsQueryController,
    PermissionsCommandController,
} from './controllers/permissions.controller';
import {
    PoliciesQueryController,
    PoliciesCommandController,
} from './controllers/policies.controller';
import {
    PolicyBindingsQueryController,
    PolicyBindingsCommandController,
} from './controllers/policy-bindings.controller';

@Module({
    imports: [DrizzlePgModule, CommonModule],
    controllers: [
        OrganizationalResourcesQueryController,
        OrganizationalResourcesCommandController,
        RolesQueryController,
        RolesCommandController,
        PermissionsQueryController,
        PermissionsCommandController,
        PoliciesQueryController,
        PoliciesCommandController,
        PolicyBindingsQueryController,
        PolicyBindingsCommandController,
    ],
    providers: [
        // database
        IamDbService,
        IamUnitOfWork,
        { provide: PostgresUnitOfWork, useExisting: IamUnitOfWork },
        { provide: UnitOfWorkService, useExisting: IamUnitOfWork },
        // repositories
        OrganizationalResourcesRepository,
        RolesRepository,
        PermissionsRepository,
        PoliciesRepository,
        PolicyBindingsRepository,
        RolePermissionsRepository,
        // services
        OrganizationalResourceQueryService,
        OrganizationalResourceCommandService,
        RoleQueryService,
        RoleCommandService,
        PermissionQueryService,
        PermissionCommandService,
        PolicyQueryService,
        PolicyCommandService,
        PolicyBindingQueryService,
        PolicyBindingCommandService,
    ],
    exports: [
        OrganizationalResourceQueryService,
        OrganizationalResourceCommandService,
        RoleQueryService,
        RoleCommandService,
        PermissionQueryService,
        PermissionCommandService,
        PolicyQueryService,
        PolicyCommandService,
        PolicyBindingQueryService,
        PolicyBindingCommandService,
    ],
})
export class IamRbacModule {}
