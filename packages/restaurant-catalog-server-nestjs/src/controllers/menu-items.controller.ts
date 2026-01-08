import { Controller } from '@nestjs/common';
import {
    IMenuItem,
    INewMenuItem,
    MenuItem,
    MenuItemSchema,
    NewMenuItemSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server';
import { ApiTags } from '@nestjs/swagger';
import {
    MenuItemCommandService,
    MenuItemQueryService,
} from '../services/menu-item.service';
import { RESTAURANT_CATALOG_TAG } from './api-tags';

const menuItemQueryController = createQueryController<IMenuItem>(MenuItem);

const menuItemCommandController = createCommandController<
    INewMenuItem,
    IMenuItem
>(MenuItem, NewMenuItemSchema, MenuItemSchema);

const RESOURCE_NAME = 'menu-items';

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(RESOURCE_NAME)
export class MenuItemsQueryController extends menuItemQueryController {
    constructor(service: MenuItemQueryService) {
        super(service);
    }
}

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(RESOURCE_NAME)
export class MenuItemsCommandController extends menuItemCommandController {
    constructor(service: MenuItemCommandService) {
        super(service);
    }
}
