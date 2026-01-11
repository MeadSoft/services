import { Controller } from '@nestjs/common';
import {
    IMenuItemToTag,
    MenuItemToTag,
    MenuItemToTagSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import {
    MenuItemToTagCommandService,
    MenuItemToTagQueryService,
} from '../services/menu-item-to-tag.service';
import { RESTAURANT_CATALOG_TAG } from './api-tags';

const menuItemToTagQueryController =
    createQueryController<IMenuItemToTag>(MenuItemToTag);

const menuItemToTagCommandController = createCommandController<
    IMenuItemToTag,
    IMenuItemToTag
>(MenuItemToTag, MenuItemToTagSchema, MenuItemToTagSchema);

const RESOURCE_NAME = 'menu-item-to-tag';

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(RESOURCE_NAME)
export class MenuItemToTagQueryController extends menuItemToTagQueryController {
    constructor(service: MenuItemToTagQueryService) {
        super(service);
    }
}

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(RESOURCE_NAME)
export class MenuItemToTagCommandController extends menuItemToTagCommandController {
    constructor(service: MenuItemToTagCommandService) {
        super(service);
    }
}
