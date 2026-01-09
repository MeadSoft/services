import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';
import { createZodDto } from 'nestjs-zod';

export const TagResourceName = 'tag';
export const NewTagSchema = z.object({
    name: z.string(),
});
export const TagSchema = EntitySchema.extend(NewTagSchema.shape);
export const NewTagJsonSchema = z.toJSONSchema(NewTagSchema);
export const TagJsonSchema = z.toJSONSchema(TagSchema);
export type INewTag = z.infer<typeof NewTagSchema>;
export class NewTag extends createZodDto(NewTagSchema) {}
export type ITag = z.infer<typeof TagSchema>;
export class Tag extends createZodDto(TagSchema) {}
