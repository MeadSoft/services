import { EntitySchema } from '@meadsoft/common';
import { z } from 'zod';

export const MENU_ITEM_TO_SIZE_RESOURCE_NAME = 'menu-item-to-size';

export const NewMenuItemToSizeSchema = z.object({
    menuItemId: z.uuid(),
    sizeId: z.uuid(),
});
export const MenuItemToSizeSchema = EntitySchema.extend(
    NewMenuItemToSizeSchema.shape,
);
export const MenuItemToSizeJsonSchema = z.toJSONSchema(MenuItemToSizeSchema);
export type INewMenuItemToSize = z.infer<typeof NewMenuItemToSizeSchema>;
export type IMenuItemToSize = z.infer<typeof MenuItemToSizeSchema>;
export class MenuItemToSize implements IMenuItemToSize {
    id: string;
    menuItemId: string;
    sizeId: string;
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;

    constructor(data: IMenuItemToSize) {
        this.id = data.id;
        this.menuItemId = data.menuItemId;
        this.sizeId = data.sizeId;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
    }
}
