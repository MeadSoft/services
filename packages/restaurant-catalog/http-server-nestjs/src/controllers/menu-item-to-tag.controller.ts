import { Controller } from '@nestjs/common';
import {
    IMenuItemToTag,
    MenuItemToTag,
    MenuItemToTagSchema,
    MENU_ITEM_TO_TAG_RESOURCE_NAME,
    SERVICE_NAME,
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

const menuItemToTagQueryController = createQueryController<IMenuItemToTag>(
    MenuItemToTag,
    SERVICE_NAME,
    MENU_ITEM_TO_TAG_RESOURCE_NAME,
);

const menuItemToTagCommandController = createCommandController<
    IMenuItemToTag,
    IMenuItemToTag
>(MenuItemToTag, MenuItemToTagSchema, MenuItemToTagSchema);

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(MENU_ITEM_TO_TAG_RESOURCE_NAME)
export class MenuItemToTagQueryController extends menuItemToTagQueryController {
    constructor(service: MenuItemToTagQueryService) {
        super(service);
    }
}

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(MENU_ITEM_TO_TAG_RESOURCE_NAME)
export class MenuItemToTagCommandController extends menuItemToTagCommandController {
    constructor(service: MenuItemToTagCommandService) {
        super(service);
    }
}
