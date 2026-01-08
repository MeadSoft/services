import { Controller } from '@nestjs/common';
import {
    NewSize,
    NewSizeSchema,
    Size,
    SizeSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server';
import { ApiTags } from '@nestjs/swagger';
import {
    SizeCommandService,
    SizeQueryService,
} from '../services/sizes.service';
import { RESTAURANT_CATALOG_TAG } from './api-tags';

const sizesQueryController = createQueryController<Size>(Size);

const sizesCommandController = createCommandController<NewSize, Size>(
    Size,
    NewSizeSchema,
    SizeSchema,
);

const RESOURCE_NAME = 'sizes';

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(RESOURCE_NAME)
export class SizesQueryController extends sizesQueryController {
    constructor(service: SizeQueryService) {
        super(service);
    }
}

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(RESOURCE_NAME)
export class SizesCommandController extends sizesCommandController {
    constructor(service: SizeCommandService) {
        super(service);
    }
}
