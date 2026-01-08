import { Controller } from '@nestjs/common';
import {
    NewTag,
    NewTagSchema,
    Tag,
    TagSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server';
import { ApiTags } from '@nestjs/swagger';
import { TagsCommandService, TagsQueryService } from '../services/tags.service';
import { RESTAURANT_CATALOG_TAG } from './api-tags';

const tagsQueryController = createQueryController<Tag>(Tag);

const tagsCommandController = createCommandController<NewTag, Tag>(
    Tag,
    NewTagSchema,
    TagSchema,
);

const RESOURCE_NAME = 'tags';

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(RESOURCE_NAME)
export class TagsQueryController extends tagsQueryController {
    constructor(service: TagsQueryService) {
        super(service);
    }
}

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(RESOURCE_NAME)
export class TagsCommandController extends tagsCommandController {
    constructor(service: TagsCommandService) {
        super(service);
    }
}
