import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantCatalogModule } from './restaurant-catalog.module';
import { MenuItemRepository } from './database/repositories/menu-items.repo';
import { SizesRepository } from './database/repositories/sizes.repo';
import { TagsRepository } from './database/repositories/tags.repo';
import {
    MenuItemsQueryController,
    MenuItemsCommandController,
} from './controllers/menu-items.controller';
import { InfrastructureConfig } from '@meadsoft/common-infrastructure';
import {
    SizesCommandController,
    SizesQueryController,
} from './controllers/sizes.controller';
import {
    TagsCommandController,
    TagsQueryController,
} from './controllers/tags.controller';

describe('RestaurantCatalogModule', () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [RestaurantCatalogModule],
        })
            .overrideProvider(InfrastructureConfig)
            .useValue(new InfrastructureConfig())
            .compile();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should provide InfrastructureConfig', () => {
        const config = module.get<InfrastructureConfig>(InfrastructureConfig);
        expect(config).toBeDefined();
    });

    it('should provide MenuItemRepository', () => {
        const repository = module.get<MenuItemRepository>(MenuItemRepository);
        expect(repository).toBeDefined();
    });

    it('should provide TagsRepository', () => {
        const repository = module.get<TagsRepository>(TagsRepository);
        expect(repository).toBeDefined();
    });

    it('should provide SizesRepository', () => {
        const repository = module.get<SizesRepository>(SizesRepository);
        expect(repository).toBeDefined();
    });

    it('should provide MenuItemsQueryController', () => {
        const controller = module.get<MenuItemsQueryController>(
            MenuItemsQueryController,
        );
        expect(controller).toBeDefined();
    });

    it('should provide MenuItemsCommandController', () => {
        const controller = module.get<MenuItemsCommandController>(
            MenuItemsCommandController,
        );
        expect(controller).toBeDefined();
    });

    it('should provide MenuItemsQueryController', () => {
        const controller = module.get<MenuItemsQueryController>(
            MenuItemsQueryController,
        );
        expect(controller).toBeDefined();
    });

    it('should provide MenuItemsCommandController', () => {
        const controller = module.get<MenuItemsCommandController>(
            MenuItemsCommandController,
        );
        expect(controller).toBeDefined();
    });

    it('should provide SizesQueryController', () => {
        const controller =
            module.get<SizesQueryController>(SizesQueryController);
        expect(controller).toBeDefined();
    });

    it('should provide SizesCommandController', () => {
        const controller = module.get<SizesCommandController>(
            SizesCommandController,
        );
        expect(controller).toBeDefined();
    });

    it('should provide TagsQueryController', () => {
        const controller = module.get<TagsQueryController>(TagsQueryController);
        expect(controller).toBeDefined();
    });

    it('should provide TagsCommandController', () => {
        const controller = module.get<TagsCommandController>(
            TagsCommandController,
        );
        expect(controller).toBeDefined();
    });
});
