import { Controller } from '@nestjs/common';
import {
    Permission,
    PERMISSIONS_RESOURCE_NAME,
    SERVICE_NAME,
} from '@meadsoft/iam-contracts';
import { createQueryController } from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import { PermissionQueryService } from '../services/permission.service';
import { IAM_TAG } from './api-tags';

const permissionsQueryController = createQueryController<Permission>(
    Permission,
    SERVICE_NAME,
    PERMISSIONS_RESOURCE_NAME,
);

@ApiTags(IAM_TAG)
@Controller(PERMISSIONS_RESOURCE_NAME)
export class PermissionsQueryController extends permissionsQueryController {
    constructor(service: PermissionQueryService) {
        super(service);
    }
}
