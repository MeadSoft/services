import { Controller } from '@nestjs/common';
import {
    INewRole,
    NewRoleSchema,
    Role,
    RoleSchema,
    ROLE_RESOURCE_NAME,
} from '@meadsoft/iam-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import {
    RoleCommandService,
    RoleQueryService,
} from '../services/role.service';
import { IAM_TAG } from './api-tags';

const rolesQueryController = createQueryController<Role>(Role);

const rolesCommandController = createCommandController<INewRole, Role>(
    Role,
    NewRoleSchema,
    RoleSchema,
);

@ApiTags(IAM_TAG)
@Controller(ROLE_RESOURCE_NAME)
export class RolesQueryController extends rolesQueryController {
    constructor(service: RoleQueryService) {
        super(service);
    }
}

@ApiTags(IAM_TAG)
@Controller(ROLE_RESOURCE_NAME)
export class RolesCommandController extends rolesCommandController {
    constructor(service: RoleCommandService) {
        super(service);
    }
}
