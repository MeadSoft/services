import { Controller } from '@nestjs/common';
import {
    INewOrganizationalResource,
    NewOrganizationalResourceSchema,
    OrganizationalResource,
    OrganizationalResourceSchema,
    ORGANIZATIONAL_RESOURCE_RESOURCE_NAME,
} from '@meadsoft/iam-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import {
    OrganizationalResourceCommandService,
    OrganizationalResourceQueryService,
} from '../services/organizational-resource.service';
import { IAM_TAG } from './api-tags';

const organizationalResourceQueryController =
    createQueryController<OrganizationalResource>(OrganizationalResource);

const organizationalResourceCommandController = createCommandController<
    INewOrganizationalResource,
    OrganizationalResource
>(
    OrganizationalResource,
    NewOrganizationalResourceSchema,
    OrganizationalResourceSchema,
);

@ApiTags(IAM_TAG)
@Controller(ORGANIZATIONAL_RESOURCE_RESOURCE_NAME)
export class OrganizationalResourcesQueryController extends organizationalResourceQueryController {
    constructor(service: OrganizationalResourceQueryService) {
        super(service);
    }
}

@ApiTags(IAM_TAG)
@Controller(ORGANIZATIONAL_RESOURCE_RESOURCE_NAME)
export class OrganizationalResourcesCommandController extends organizationalResourceCommandController {
    constructor(service: OrganizationalResourceCommandService) {
        super(service);
    }
}
