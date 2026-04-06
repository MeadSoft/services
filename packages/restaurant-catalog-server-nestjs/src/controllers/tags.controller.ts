import { Controller } from '@nestjs/common';
import {
    INewTag,
    NewTagSchema,
    Tag,
    TagSchema,
    TAG_RESOURCE_NAME,
} from '@meadsoft/restaurant-catalog-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import { TagsCommandService, TagsQueryService } from '../services/tags.service';
import { RESTAURANT_CATALOG_TAG } from './api-tags';

const tagsQueryController = createQueryController<Tag>(Tag);

const tagsCommandController = createCommandController<INewTag, Tag>(
    Tag,
    NewTagSchema,
    TagSchema,
);

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(TAG_RESOURCE_NAME)
export class TagsQueryController extends tagsQueryController {
    constructor(service: TagsQueryService) {
        super(service);
    }
}

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(TAG_RESOURCE_NAME)
export class TagsCommandController extends tagsCommandController {
    constructor(service: TagsCommandService) {
        super(service);
    }
}
