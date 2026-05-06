import { Controller } from '@nestjs/common';
import {
    INewPolicy,
    NewPolicySchema,
    Policy,
    PolicySchema,
    POLICIES_RESOURCE_NAME,
    SERVICE_NAME,
} from '@meadsoft/iam-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import {
    PolicyCommandService,
    PolicyQueryService,
} from '../services/policy.service';
import { IAM_TAG } from './api-tags';

const policiesQueryController = createQueryController<Policy>(
    Policy,
    SERVICE_NAME,
    POLICIES_RESOURCE_NAME,
);

const policiesCommandController = createCommandController<INewPolicy, Policy>(
    Policy,
    NewPolicySchema,
    PolicySchema,
);

@ApiTags(IAM_TAG)
@Controller(POLICIES_RESOURCE_NAME)
export class PoliciesQueryController extends policiesQueryController {
    constructor(service: PolicyQueryService) {
        super(service);
    }
}

@ApiTags(IAM_TAG)
@Controller(POLICIES_RESOURCE_NAME)
export class PoliciesCommandController extends policiesCommandController {
    constructor(service: PolicyCommandService) {
        super(service);
    }
}
