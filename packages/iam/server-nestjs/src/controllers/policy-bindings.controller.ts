import { Controller } from '@nestjs/common';
import {
    INewPolicyBinding,
    NewPolicyBindingSchema,
    PolicyBinding,
    PolicyBindingSchema,
    POLICY_BINDING_RESOURCE_NAME,
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

const policyBindingsQueryController =
    createQueryController<PolicyBinding>(PolicyBinding);

const policyBindingsCommandController = createCommandController<
    INewPolicyBinding,
    PolicyBinding
>(PolicyBinding, NewPolicyBindingSchema, PolicyBindingSchema);

@ApiTags(IAM_TAG)
@Controller(POLICY_BINDING_RESOURCE_NAME)
export class PolicyBindingsQueryController extends policyBindingsQueryController {
    constructor(service: PolicyBindingQueryService) {
        super(service);
    }
}

@ApiTags(IAM_TAG)
@Controller(POLICY_BINDING_RESOURCE_NAME)
export class PolicyBindingsCommandController extends policyBindingsCommandController {
    constructor(service: PolicyBindingCommandService) {
        super(service);
    }
}
