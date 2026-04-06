import { Controller } from '@nestjs/common';
import {
    INewSize,
    NewSizeSchema,
    Size,
    SizeSchema,
    SIZE_RESOURCE_NAME,
} from '@meadsoft/restaurant-catalog-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import {
    SizeCommandService,
    SizeQueryService,
} from '../services/sizes.service';
import { RESTAURANT_CATALOG_TAG } from './api-tags';

const sizesQueryController = createQueryController<Size>(Size);

const sizesCommandController = createCommandController<INewSize, Size>(
    Size,
    NewSizeSchema,
    SizeSchema,
);

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(SIZE_RESOURCE_NAME)
export class SizesQueryController extends sizesQueryController {
    constructor(service: SizeQueryService) {
        super(service);
    }
}

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(SIZE_RESOURCE_NAME)
export class SizesCommandController extends sizesCommandController {
    constructor(service: SizeCommandService) {
        super(service);
    }
}
