import { Controller } from '@nestjs/common';
import {
    INewPermission,
    NewPermissionSchema,
    Permission,
    PermissionSchema,
    PERMISSIONS_RESOURCE_NAME,
    SERVICE_NAME,
} from '@meadsoft/iam-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import {
    PermissionCommandService,
    PermissionQueryService,
} from '../services/permission.service';
import { IAM_TAG } from './api-tags';

const permissionsQueryController = createQueryController<Permission>(
    Permission,
    SERVICE_NAME,
    PERMISSIONS_RESOURCE_NAME,
);

const permissionsCommandController = createCommandController<
    INewPermission,
    Permission
>(Permission, NewPermissionSchema, PermissionSchema);

@ApiTags(IAM_TAG)
@Controller(PERMISSIONS_RESOURCE_NAME)
export class PermissionsQueryController extends permissionsQueryController {
    constructor(service: PermissionQueryService) {
        super(service);
    }
}

@ApiTags(IAM_TAG)
@Controller(PERMISSIONS_RESOURCE_NAME)
export class PermissionsCommandController extends permissionsCommandController {
    constructor(service: PermissionCommandService) {
        super(service);
    }
}
