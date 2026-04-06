import { z } from 'zod';
import {
    EntitySchema,
    DEFAULT_STRING_LENGTH,
    IEntity,
} from '@meadsoft/common-browser';
import { ITag, TagSchema } from './tags.schema';
import { ISize, SizeSchema } from './sizes.schema';

export const MENU_ITEM_IS_FAVORITE_DEFAULT = false;
export const MENU_ITEM_IS_ACTIVE_DEFAULT = false;
export const MENU_ITEM_RESOURCE_NAME = 'menu-items';

export const NewMenuItemSchema = z.object({
    name: z.string().nonempty().max(DEFAULT_STRING_LENGTH),
    description: z.string().nullable().default(null),
    imageUrl: z.string().nullable().default(null),
    price: z.number().nullable().default(null),
    isFavorite: z.boolean().default(MENU_ITEM_IS_FAVORITE_DEFAULT),
    isActive: z.boolean().default(MENU_ITEM_IS_ACTIVE_DEFAULT),
});
export const MenuItemSchema = EntitySchema.extend(NewMenuItemSchema.shape);
export type INewMenuItem = z.infer<typeof NewMenuItemSchema>;
export type IMenuItem = IEntity & z.infer<typeof MenuItemSchema>;
export const NewMenuItemWithRelationsSchema = NewMenuItemSchema.extend({
    tags: z.uuid().array().optional(),
    sizes: z.uuid().array().optional(),
});
export const MenuItemWithRelationsSchema = MenuItemSchema.extend({
    tags: z.array(TagSchema),
    sizes: z.array(SizeSchema),
});
export type IMenuItemWithRelations = z.infer<
    typeof MenuItemWithRelationsSchema
>;
export type INewMenuItemWithRelations = IMenuItem &
    z.infer<typeof NewMenuItemWithRelationsSchema>;
export class MenuItem implements IMenuItem {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    isFavorite: boolean;
    isActive: boolean;
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;

    constructor(data: IMenuItem) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.imageUrl = data.imageUrl;
        this.price = data.price;
        this.isFavorite = data.isFavorite;
        this.isActive = data.isActive;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
    }
}
export class MenuItemWithRelations
    extends MenuItem
    implements IMenuItemWithRelations
{
    tags: ITag[] = [];
    sizes: ISize[] = [];

    constructor(
        data: IMenuItem,
        tags: ITag[] | null = null,
        sizes: ISize[] | null = null,
    ) {
        super(data);
        this.tags = tags ?? [];
        this.sizes = sizes ?? [];
    }
}
