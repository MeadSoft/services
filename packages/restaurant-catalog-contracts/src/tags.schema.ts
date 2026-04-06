import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common-browser';

export const TAG_RESOURCE_NAME = 'tag';

export const NewTagSchema = z.object({
    name: z.string(),
});
export const TagSchema = EntitySchema.extend(NewTagSchema.shape);
export const NewTagJsonSchema = z.toJSONSchema(NewTagSchema);
export const TagJsonSchema = z.toJSONSchema(TagSchema);
export type INewTag = z.infer<typeof NewTagSchema>;
export type ITag = z.infer<typeof TagSchema>;
export class Tag implements ITag {
    id: string;
    name: string;
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;

    constructor(data: ITag) {
        this.id = data.id;
        this.name = data.name;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
    }
}
