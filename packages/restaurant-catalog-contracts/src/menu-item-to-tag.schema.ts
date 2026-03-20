import { EntitySchema } from '@meadsoft/common-browser';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const MenuItemToTagResourceName = 'menu-item-to-tag';

export const NewMenuItemToTagSchema = z.object({
    menuItemId: z.uuid(),
    tagId: z.uuid(),
});
export const MenuItemToTagSchema = EntitySchema.extend(
    NewMenuItemToTagSchema.shape,
);
export const MenuItemToTagJsonSchema = z.toJSONSchema(MenuItemToTagSchema);
export type INewMenuItemToTag = z.infer<typeof NewMenuItemToTagSchema>;
export class NewMenuItemToTag extends createZodDto(NewMenuItemToTagSchema) {}
export type IMenuItemToTag = z.infer<typeof MenuItemToTagSchema>;
export class MenuItemToTag extends createZodDto(MenuItemToTagSchema) {}
