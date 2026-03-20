import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common-browser';
import { createZodDto } from 'nestjs-zod';

export const SizeResourceName = 'size';

export const NewSizeSchema = z.object({
    name: z.string(),
});
export const SizeSchema = EntitySchema.extend(NewSizeSchema.shape);
export const NewSizeJsonSchema = z.toJSONSchema(NewSizeSchema);
export const SizeJsonSchema = z.toJSONSchema(SizeSchema);
export type INewSize = z.infer<typeof NewSizeSchema>;
export class NewSize extends createZodDto(NewSizeSchema) {}
export type ISize = z.infer<typeof SizeSchema>;
export class Size extends createZodDto(SizeSchema) {}
