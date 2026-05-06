import { z } from 'zod';
import { EntitySchema } from '@meadsoft/common';

export const ORGANIZATIONAL_RESOURCES_RESOURCE_NAME = 'OrganizationalResources';

// new organizational resource
export const NewOrganizationalResourceSchema = z.object({
    name: z.string().nonempty(),
    description: z.string().nullable(),
});
export type INewOrganizationalResource = z.infer<
    typeof NewOrganizationalResourceSchema
>;

// organizational resource
export const OrganizationalResourceSchema = z
    .object(NewOrganizationalResourceSchema.shape)
    .extend(EntitySchema.shape);
export type IOrganizationalResource = z.infer<
    typeof OrganizationalResourceSchema
>;

export class OrganizationalResource implements IOrganizationalResource {
    id: string;
    name: string;
    description: string | null;
    createdDate: string | null;
    updatedDate: string | null;
    createdById: string | null;
    updatedById: string | null;

    constructor(data: IOrganizationalResource) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.createdDate = data.createdDate;
        this.updatedDate = data.updatedDate;
        this.createdById = data.createdById;
        this.updatedById = data.updatedById;
    }
}
