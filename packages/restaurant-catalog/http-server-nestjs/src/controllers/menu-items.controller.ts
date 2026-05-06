import { Controller, Get, Param } from '@nestjs/common';
import {
    IMenuItem,
    INewMenuItem,
    MenuItem,
    MenuItemSchema,
    NewMenuItemSchema,
    MENU_ITEM_RESOURCE_NAME,
    IMenuItemWithRelations,
    MenuItemWithRelations,
    SERVICE_NAME,
} from '@meadsoft/restaurant-catalog-contracts';
import {
    createCommandController,
    createQueryController,
} from '@meadsoft/common-http-server-nestjs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    MenuItemCommandService,
    MenuItemQueryService,
} from '../services/menu-item.service';
import { RESTAURANT_CATALOG_TAG } from './api-tags';

const menuItemQueryController = createQueryController<IMenuItem>(
    MenuItem,
    SERVICE_NAME,
    MENU_ITEM_RESOURCE_NAME,
);

const menuItemCommandController = createCommandController<
    INewMenuItem,
    IMenuItem
>(MenuItem, NewMenuItemSchema, MenuItemSchema);

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(MENU_ITEM_RESOURCE_NAME)
export class MenuItemsQueryController extends menuItemQueryController {
    constructor(private readonly _service: MenuItemQueryService) {
        super(_service);
    }

    @Get('/with-relations/:id')
    @ApiOkResponse({ type: MenuItemWithRelations, isArray: true })
    async findOneWithRelations(
        @Param('id') id: string,
    ): Promise<IMenuItemWithRelations | null> {
        return await this._service.findOneWithRelations(id);
    }

    @Get('/with-relations')
    @ApiOkResponse({ type: MenuItemWithRelations, isArray: true })
    async findManyWithRelations(): Promise<IMenuItemWithRelations[]> {
        return await this._service.findManyWithRelations();
    }
}

@ApiTags(RESTAURANT_CATALOG_TAG)
@Controller(MENU_ITEM_RESOURCE_NAME)
export class MenuItemsCommandController extends menuItemCommandController {
    constructor(service: MenuItemCommandService) {
        super(service);
    }
}
