import { Controller } from '@nestjs/common';
import {
    INewRole,
    NewRoleSchema,
    Role,
    RoleSchema,
    ROLES_RESOURCE_NAME,
    SERVICE_NAME,
} from '@meadsoft/iam-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import { RoleCommandService, RoleQueryService } from '../services/role.service';
import { IAM_TAG } from './api-tags';

const rolesQueryController = createQueryController<Role>(
    Role,
    SERVICE_NAME,
    ROLES_RESOURCE_NAME,
);

const rolesCommandController = createCommandController<INewRole, Role>(
    Role,
    NewRoleSchema,
    RoleSchema,
);

@ApiTags(IAM_TAG)
@Controller(ROLES_RESOURCE_NAME)
export class RolesQueryController extends rolesQueryController {
    constructor(service: RoleQueryService) {
        super(service);
    }
}

@ApiTags(IAM_TAG)
@Controller(ROLES_RESOURCE_NAME)
export class RolesCommandController extends rolesCommandController {
    constructor(service: RoleCommandService) {
        super(service);
    }
}
