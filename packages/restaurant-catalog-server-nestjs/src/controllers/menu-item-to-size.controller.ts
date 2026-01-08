import { Controller } from '@nestjs/common';
import {
    IMenuItemToSize,
    MenuItemToSize,
    MenuItemToSizeSchema,
} from '@meadsoft/restaurant-catalog-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server';
import { ApiTags } from '@nestjs/swagger';
import {
    MenuItemToSizeCommandService,
    MenuItemToSizeQueryService,
} from '../services/menu-item-to-size.service';
import { RESTAURANT_CATALOG_TAG } from './api-tags';

const menuItemToSizeQueryController =
    createQueryController<IMenuItemToSize>(MenuItemToSize);

const menuItemToSizeCommandController = createCommandController<
    IMenuItemToSize,
    IMenuItemToSize
>(MenuItemToSize, MenuItemToSizeSchema, MenuItemToSizeSchema);

const RESOURCE_NAME = 'menu-item-to-size';

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(RESOURCE_NAME)
export class MenuItemToSizeQueryController extends menuItemToSizeQueryController {
    constructor(service: MenuItemToSizeQueryService) {
        super(service);
    }
}

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(RESOURCE_NAME)
export class MenuItemToSizeCommandController extends menuItemToSizeCommandController {
    constructor(service: MenuItemToSizeCommandService) {
        super(service);
    }
}
