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
