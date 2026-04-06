import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common-browser';

export const SIZE_RESOURCE_NAME = 'size';

export const NewSizeSchema = z.object({
    name: z.string(),
});
export const SizeSchema = EntitySchema.extend(NewSizeSchema.shape);
export const NewSizeJsonSchema = z.toJSONSchema(NewSizeSchema);
export const SizeJsonSchema = z.toJSONSchema(SizeSchema);
export type INewSize = z.infer<typeof NewSizeSchema>;
export type ISize = z.infer<typeof SizeSchema>;
export class Size implements ISize {
    id: string;
    name: string;
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;

    constructor(data: ISize) {
        this.id = data.id;
        this.name = data.name;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
    }
}
