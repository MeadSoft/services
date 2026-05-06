import { Controller } from '@nestjs/common';
import {
    IMenuItemToSize,
    MenuItemToSize,
    MenuItemToSizeSchema,
    MENU_ITEM_TO_SIZE_RESOURCE_NAME,
    SERVICE_NAME,
} from '@meadsoft/restaurant-catalog-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiTags } from '@nestjs/swagger';
import {
    MenuItemToSizeCommandService,
    MenuItemToSizeQueryService,
} from '../services/menu-item-to-size.service';
import { RESTAURANT_CATALOG_TAG } from './api-tags';

const menuItemToSizeQueryController = createQueryController<IMenuItemToSize>(
    MenuItemToSize,
    SERVICE_NAME,
    MENU_ITEM_TO_SIZE_RESOURCE_NAME,
);

const menuItemToSizeCommandController = createCommandController<
    IMenuItemToSize,
    IMenuItemToSize
>(MenuItemToSize, MenuItemToSizeSchema, MenuItemToSizeSchema);

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(MENU_ITEM_TO_SIZE_RESOURCE_NAME)
export class MenuItemToSizeQueryController extends menuItemToSizeQueryController {
    constructor(service: MenuItemToSizeQueryService) {
        super(service);
    }
}

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(MENU_ITEM_TO_SIZE_RESOURCE_NAME)
export class MenuItemToSizeCommandController extends menuItemToSizeCommandController {
    constructor(service: MenuItemToSizeCommandService) {
        super(service);
    }
}
