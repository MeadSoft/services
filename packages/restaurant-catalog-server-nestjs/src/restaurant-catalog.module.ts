import { Module } from '@nestjs/common';
import { DrizzlePgModule } from '@meadsoft/common-infrastructure';
import { CommonModule } from '@meadsoft/common';
import { MenuItemRepository } from './database/repositories/menu-items.repo';
import { SizesRepository } from './database/repositories/sizes.repo';
import { TagsRepository } from './database/repositories/tags.repo';
import {
    MenuItemsQueryController,
    MenuItemsCommandController,
} from './controllers/menu-items.controller';
import {
    SizesCommandController,
    SizesQueryController,
} from './controllers/sizes.controller';
import {
    TagsCommandController,
    TagsQueryController,
} from './controllers/tags.controller';
import { MenuItemToSizeRepository } from './database/repositories/menu-item-to-size.repo';
import { MenuItemToTagRepository } from './database/repositories';
import {
    MenuItemCommandService,
    MenuItemQueryService,
} from './services/menu-item.service';
import { TagsCommandService, TagsQueryService } from './services/tags.service';
import { SizeCommandService, SizeQueryService } from './services/sizes.service';
import {
    MenuItemToTagCommandService,
    MenuItemToTagQueryService,
} from './services/menu-item-to-tag.service';
import {
    MenuItemToSizeCommandService,
    MenuItemToSizeQueryService,
} from './services/menu-item-to-size.service';
import {
    MenuItemToSizeCommandController,
    MenuItemToSizeQueryController,
    MenuItemToTagCommandController,
    MenuItemToTagQueryController,
} from './controllers';

@Module({
    imports: [DrizzlePgModule, CommonModule],
    controllers: [
        MenuItemsQueryController,
        MenuItemsCommandController,
        SizesQueryController,
        SizesCommandController,
        TagsQueryController,
        TagsCommandController,
        MenuItemToSizeQueryController,
        MenuItemToSizeCommandController,
        MenuItemToTagQueryController,
        MenuItemToTagCommandController,
    ],
    providers: [
        MenuItemRepository,
        MenuItemQueryService,
        MenuItemCommandService,
        TagsRepository,
        TagsQueryService,
        TagsCommandService,
        SizesRepository,
        SizeQueryService,
        SizeCommandService,
        MenuItemToSizeRepository,
        MenuItemToSizeQueryService,
        MenuItemToSizeCommandService,
        MenuItemToTagRepository,
        MenuItemToTagQueryService,
        MenuItemToTagCommandService,
    ],
    exports: [
        MenuItemQueryService,
        MenuItemCommandService,
        TagsQueryService,
        TagsCommandService,
        SizeQueryService,
        SizeCommandService,
    ],
})
export class RestaurantCatalogModule {}
