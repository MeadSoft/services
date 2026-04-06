import { EntitySchema } from '@meadsoft/common-browser';
import { z } from 'zod';

export const MENU_ITEM_TO_TAG_RESOURCE_NAME = 'menu-item-to-tag';

export const NewMenuItemToTagSchema = z.object({
    menuItemId: z.uuid(),
    tagId: z.uuid(),
});
export const MenuItemToTagSchema = EntitySchema.extend(
    NewMenuItemToTagSchema.shape,
);
export const MenuItemToTagJsonSchema = z.toJSONSchema(MenuItemToTagSchema);
export type INewMenuItemToTag = z.infer<typeof NewMenuItemToTagSchema>;
export type IMenuItemToTag = z.infer<typeof MenuItemToTagSchema>;
export class MenuItemToTag implements IMenuItemToTag {
    id: string;
    menuItemId: string;
    tagId: string;
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;

    constructor(data: IMenuItemToTag) {
        this.id = data.id;
        this.menuItemId = data.menuItemId;
        this.tagId = data.tagId;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
    }
}
