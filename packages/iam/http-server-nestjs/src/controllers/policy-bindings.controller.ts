import { Controller } from '@nestjs/common';
import {
    INewPolicyBinding,
    NewPolicyBindingSchema,
    PolicyBinding,
    PolicyBindingSchema,
    POLICY_BINDINGS_RESOURCE_NAME,
    SERVICE_NAME,
} from '@meadsoft/iam-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import {
    PolicyBindingCommandService,
    PolicyBindingQueryService,
} from '../services/policy-binding.service';
import { IAM_TAG } from './api-tags';

const policyBindingsQueryController = createQueryController<PolicyBinding>(
    PolicyBinding,
    SERVICE_NAME,
    POLICY_BINDINGS_RESOURCE_NAME,
);

const policyBindingsCommandController = createCommandController<
    INewPolicyBinding,
    PolicyBinding
>(PolicyBinding, NewPolicyBindingSchema, PolicyBindingSchema);

@ApiTags(IAM_TAG)
@Controller(POLICY_BINDINGS_RESOURCE_NAME)
export class PolicyBindingsQueryController extends policyBindingsQueryController {
    constructor(service: PolicyBindingQueryService) {
        super(service);
    }
}

@ApiTags(IAM_TAG)
@Controller(POLICY_BINDINGS_RESOURCE_NAME)
export class PolicyBindingsCommandController extends policyBindingsCommandController {
    constructor(service: PolicyBindingCommandService) {
        super(service);
    }
}
