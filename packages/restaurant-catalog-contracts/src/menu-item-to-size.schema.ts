import { EntitySchema } from '@meadsoft/common';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const MenuItemToSizeResourceName = 'menu-item-to-size';

export const NewMenuItemToSizeSchema = z.object({
    menuItemId: z.uuid(),
    sizeId: z.uuid(),
});
export const MenuItemToSizeSchema = EntitySchema.extend(
    NewMenuItemToSizeSchema.shape,
);
export const MenuItemToSizeJsonSchema = z.toJSONSchema(MenuItemToSizeSchema);
export type INewMenuItemToSize = z.infer<typeof NewMenuItemToSizeSchema>;
export class NewMenuItemToSize extends createZodDto(NewMenuItemToSizeSchema) {}
export type IMenuItemToSize = z.infer<typeof MenuItemToSizeSchema>;
export class MenuItemToSize extends createZodDto(MenuItemToSizeSchema) {}
